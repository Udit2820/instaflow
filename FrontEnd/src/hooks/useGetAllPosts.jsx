import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllPosts = ()=>{
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPost = async()=>{
            try{
                const res= await axios.get("https://instaflow.onrender.com/api/v2/post/all",{withCredentials:true});
                if(res.data.success){
                    dispatch(setPosts(res.data.posts));
                    // console.log(res.data)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchAllPost();
    },[])
}

export default useGetAllPosts;