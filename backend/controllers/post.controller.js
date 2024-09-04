import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId , io } from "../socket/socket.js";

export const addNewPost = async (req,res) => {
    try{
         const {caption}=req.body;
         const img =req.file;
         const authorId=req.id;
          
         if(!img) return res.status(400).json({message:'Image required'});

         //image upload
         const optimizedImageBuffer = await sharp(img.buffer)
         .resize({width:800,heigth:800,fit:"inside"})
         .toFormat('jpeg',{quality:80})
         .toBuffer();

         const fileUri =`data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
         const cloudResponse=await cloudinary.uploader.upload(fileUri);
         const post = await Post.create({
            caption,
            img:cloudResponse.secure_url,
            author:authorId
         });

         const user = await User.findById(authorId);
         if(user){
            user.posts.push(post._id);
            await user.save();
         }

         await post.populate({path:'author',select:'-password'});
         return res.status(201).json({
            message:'Post created successfully',
            post,
            success:true
         })
    }
    catch(error){
        console.log(error);
    }
}

export const getAllPosts = async (req,res) => {
    try{
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author',select:'username profilePicture'})
        .populate({path:'comments',sort:{createdAt:-1},
         populate:{path:'author',select:'username profilePicture'}})
        return res.status(200).json({
            posts,
            success:true
        })
    }
    catch(error){
        console.log(error);
    }
};

export const getUserPosts = async (req,res) => {
    try{
        const authorId=req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',select:'username profilePicture'})
            .populate({path:'comments',sort:{createdAt:-1},
            populate:{path:'author',select:'username profilePicture'}
        });
        
        return res.status(200).json({
                posts,
                success:true
        })
    }catch(error){
        console.log(error);
    }
};

export const likePost = async (req,res)=>{
    try{
        const likeKrneWalaUserkiId = req.id; 
        const postId=req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message:'Post not found', success:false});
        }

        //like logic
        await post.updateOne({$addToSet:{likes:likeKrneWalaUserkiId}})
        await post.save();

        //implementing socket io for real time notification
        const user = await User.findById(likeKrneWalaUserkiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId!== likeKrneWalaUserkiId){
            const notification = {
                userId:likeKrneWalaUserkiId,
                type: 'like',
                userDetails:user,
                postId,
                message:'your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
            
        }

        return res.status(200).json({
            message:'Post liked successfully',
            success:true
        })

    }catch(error){
        console.log(error);
    }
}

export const dislikePost = async (req,res)=>{
    try{
        const likeKrneWalaUserkiId = req.id; 
        const postId=req.params.id;
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({message:'Post not found', success:false});
        }

        //like logic
        await post.updateOne({$pull:{likes:likeKrneWalaUserkiId}})
        await post.save();

        //implementing socket io for real time notification
        const user = await User.findById(likeKrneWalaUserkiId).select('username profilePicture');
        const postOwnerId = post.author.toString();
        if(postOwnerId!== likeKrneWalaUserkiId){
            const notification = {
                userId:likeKrneWalaUserkiId,
                type: 'dislike',
                userDetails:user,
                postId,
                message:'your post was disliked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification);
        }

        return res.status(200).json({
            message:'Post Disliked successfully',
            success:true
        })

    }catch(error){
        console.log(error);
    }
};

export const addComment = async (req,res)=>{
  try{
    const postId = req.params.id;
    const commnetKrneWalaUserKiId = req.id;
    const {text}=req.body;
    const post = await Post.findById(postId);
    if(!text) return res.status(400).json({message:'text is required',success: false});

    const comment = await Comment.create({
      text,
      author:commnetKrneWalaUserKiId,
      post:postId
    })
    await comment.populate({
        path:'author',
        select:'username profilePicture'
    });
    post.comments.push(comment._id);
    await post.save();
     return res.status(201).json({
        message:'Comment added successfully',
        comment,
        success:true
     })
    
  }catch(error){
    console.log(error);
  }
};

export const getCommentsOfPost = async (req,res) => {
    try{
        const postId = req.params.Id;
        const comments = await Comment.findById(postId).populate({
                path:'author',
                select:'username profilePicture'
        });
        if(!comments) return res.status(404).json({message:'No commnents Found', success:false});
        return res.status(200).json({
            comments,
            success:true
        })
    }
    catch(error){
        console.log(error);
    }
};

export const deletePost = async (req,res) => {
    try{
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        //check if the logged in user is the owner
        if(post.author.toString()!==authorId) return res.status(403).json({message:'Unauthorized'});
        await Post.findByIdAndDelete(postId);

        //remove id from post of user
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);

        await user.save();

        //delete assocciated comments from post
        await Comment.deleteMany({post:postId});
        return res.status(200).json({message:'Post deleted successfully', success:true});

    }
    catch(error){
        console.log(error);
    }
};

export const bookmarkPost = async (req,res) =>{
    try{
        const postId = req.params.postId;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});

        const user = await User.findById(authorId);
        if(user.saved.includes(post._id)){
            await User.updateOne({$pull:{saved:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved',message:'Post unsaved successfully', success:true});
        }
        else{
            await User.updateOne({$addToSet:{saved:post._id}});
            await user.save();
            return res.status(200).json({type:'saved',message:'Post saved successfully', success:true});

        }
    }catch(error){
        console.log(error);
    }
}
