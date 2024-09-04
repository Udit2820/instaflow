import React from 'react'
import Feed from './Feed'
import RightSidebar from './RightSidebar'
import { Outlet } from 'react-router-dom'
import useGetAllPosts from '@/hooks/useGetAllPosts'
import useGetSuggestedUsers from '@/hooks/useGetSugggestedUsers'

function Home() {
   useGetAllPosts();
   useGetSuggestedUsers();
  return (
    <div className='flex'>
    <div className='flex-grow'>
    <Feed/>
    <Outlet/>
    </div>
    <RightSidebar/>
    </div>
  )
}

export default Home