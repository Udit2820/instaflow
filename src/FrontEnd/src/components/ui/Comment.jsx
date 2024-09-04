import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

function Comment({comment}) {
  return (
    <div className='my-2'>
    <div className='flex gap-3 item-center'>
        <Avatar>
            <AvatarImage src={comment?.author.profilePicture}></AvatarImage>
            <AvatarFallback></AvatarFallback>
        </Avatar>
        <h1 className='font-bold text-sm'>{comment?.author.username} <sapn className="font-normal pl-1">{comment?.text}</sapn></h1>
    </div>

    </div>
  )
}

export default Comment