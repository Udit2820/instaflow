import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

function Posts() {
  const { posts } = useSelector(store => store.post);

  if (!posts || posts.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <div>
      {posts.map((post) => <Post key={post._id} post={post}/>)}
    </div>
  );
}


export default Posts