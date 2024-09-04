import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./button";
import { Badge } from "./badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import useGetUserProfile from "@/hooks/useGetUserProfile";

function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab,setAvtivetab]=useState('posts');
  const { userProfile , user } = useSelector((store) => store.auth);
  // console.log(userProfile);
  const isLogggedInUserProfile = user?._id === userProfile?._id;;
  const isFollowing = false;
  const handleTabChange =(tab)=>{
    setAvtivetab(tab);
  }

  const displayedPost= activeTab==='posts' ? userProfile?.posts : userProfile?.Saved ;
  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              ></AvatarImage>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
               <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {
                  isLogggedInUserProfile ? (
                    <>{/* react fragment */}
                    <Link to="/account/edit">
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">Edit profile</Button>
                    </Link>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">View Archive</Button>
                    <Button variant="secondary" className="hover:bg-gray-200 h-8">Add Tools</Button>
                  </>
                  ):(
                    isFollowing ? (<>
                      <Button  variant="secondary" className=" h-8">Unfollow</Button>
                      <Button  variant="secondary" className=" h-8">Message</Button>
                    </>
                    ):
                    (
                      <Button  className="bg-[#0095f6] hover:bg-[#35a0e8] h-8">Follow</Button>
                    )
                  )
                }
               </div>
               <div className="flex items-center gap-4">
                <p><span className="font-semibold">{userProfile?.posts.length}</span> posts</p>
                <p><span className="font-semibold">{userProfile?.followers.length}</span> followers</p>
                <p><span className="font-semibold">{userProfile?.following.length}</span> following</p>
               </div>
               <div className="flex flex-col gap-1">
                <span>{userProfile?.bio || "bio here..."}</span>
                <Badge className="w-fit" variant="secondary"><AtSign className="w-4 h-4"/><span className="pl-1">{userProfile?.username}</span></Badge>
                <span>🤫HIIIII</span>
                <span>🤫Hlo Hlo </span>
                <span>🤫helloo Hello</span>
               </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200 ">
        <div className="flex items-center justify-center gap-10 text-sm">
          <span className={`py-3 cursor-pointer ${activeTab==='posts' ? 'font-bold':''}`} onClick={()=>handleTabChange('posts')}>POSTS</span>
          <span className={`py-3 cursor-pointer ${activeTab==='saved' ? 'font-bold':''}`} onClick={()=>handleTabChange('saved')}>SAVED</span>
          <span className={`py-3 cursor-pointer ${activeTab==='reels' ? 'font-bold':''}`} onClick={()=>handleTabChange('reels')}>REELS</span>
          <span className={`py-3 cursor-pointer ${activeTab==='tags' ? 'font-bold':''}`} onClick={()=>handleTabChange('tags')}>TAGS</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {
            displayedPost?.map((post)=>{
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img src={post.img} alt='postimage' className="rounded-sm my-2 w-full aspect-square object-cover "/>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:tet-gray-300">
                        <Heart/>
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:tet-gray-300">
                        <MessageCircle/>
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
