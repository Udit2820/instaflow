import React from 'react'
import Posts from './Posts'

function Feed() {
  return (
    <div>
        <div className='flex my-8 flex-col items-center pl-[+20%]'>
            <Posts></Posts>
        </div>
    </div>
  )
}

export default Feed