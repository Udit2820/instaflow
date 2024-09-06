import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

function SuggestedUsers() {
  const { suggestedUsers } = useSelector(store => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div
            key={user?._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={user?.profilePicture}
                    alt="post_image"
                  ></AvatarImage>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link
                  to={`/profile/${user?._id}`}
                  className="font-semibold text-xs"
                >
                  {user?.username}
                </Link>
                <span className="text-gray-600 text-xs">{user?.bio}</span>
              </div>
              <span className="text-[#3BADF8] text-sm font-bold cursor-pointer hover:text-[#3495d6]">
                Follow
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;
