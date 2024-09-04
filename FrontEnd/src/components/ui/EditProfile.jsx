import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  const imageRef =useRef();
  const [loading,setLoading]=useState(false);
  const [input,setInput]=useState({
    profilePhoto:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
  });
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileChangeHandler=(e)=>{
    const file = e.target.files?.[0];
    if(file){
        setInput({...input, profilePhoto: file});
    }
  }

  const selectChangeHandler=(value)=>{
    setInput({...input,gender:value});
    
  }

const editProfileHandler=async()=>{
    const formData=new FormData();
        formData.append('bio', input.bio);
        formData.append('gender',input.gender);
        if(input.profilePhoto){
            formData.append('profilePhoto',input.profilePhoto);
        }
    try{
        setLoading(true);
        const res = await axios.post('https://instaflow.onrender.com/api/v2/user/profile/edit',formData,{
            headers: {
                'Content-Type':'multipart/form-data',
            },
            withCredentials: true
        });
        if(res.data.success){
            const updatedUserData = {
                ...user,
                bio:res.data.user?.bio,
                profilePicture:res.data.user?.profilePicture,
                gender:res.data.user?.gender
            };

            dispatch(setAuthUser(updatedUserData));
            navigate(`/profile/${user?._id}`)
            toast.success(res.data.message);
            
        }
    }catch(error){
        console.log(error);
        toast.error(error.response.data.message);
    }finally{
        setLoading(false);
    }
}

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center gap-2 justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-centergap-3">
            <Avatar>
              <AvatarImage
                src={user?.profilePicture}
                alt="post_image"
              ></AvatarImage>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600 ">
                {user?.bio || "Bio Here..."}
              </span>
            </div>
          </div>
          <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden"/>
          <Button onClick={()=>imageRef?.current.click()} className="bg-[#0095F6] hover:bg-[#318bc7]">Chnage Photo</Button>
        </div>
        <div>
            <h1 className="font-bold text-xl">Bio</h1>
            <Textarea value={input.bio} onChange={(e)=>setInput({...input,bio:e.target.value})} name='bio' className="focus-visible:ring-transparent"></Textarea>
        </div>
        <div>
            <h1 className="font-bold mb-2">Gender</h1>
            <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Gender</SelectLabel>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                </SelectContent>
             </Select>
        </div>
        <div className="flex justify-end">
        {
            loading ? ( <Button className="w-fit bg-[#0095f6] hover:bg-[#2a8ccd]">
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
            Please wait...
            </Button>):(
                <Button onClick={editProfileHandler} className="w-fit bg-[#0095f6] hover:bg-[#2a8ccd]">Submit</Button>
            )
        }
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
