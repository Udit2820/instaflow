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
      {posts
        .filter(post => post && post._id) // Filter out null, undefined, or invalid posts
        .map(post => (
          <Post key={post._id} post={post} />
        ))}
    </div>
  );
}


export default Posts