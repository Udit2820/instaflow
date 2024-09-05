import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


const useGetAllMessage = ()=>{
    const dispatch = useDispatch();
    const {selectedUser} = useSelector(store=>store.auth);
    useEffect(()=>{
        const fetchAllMessage = async()=>{
            try{
                const res= await axios.get(`https://instaflow.onrender.com/api/v2/message/all/${selectedUser?._id}`,{withCredentials:true});
                console.log("hlooooo");
                if(res.data.success){
                    debugger
                    dispatch(setMessages(res.data.messages));
                }

            }catch(error){
                console.log(error)
            }
        }
        fetchAllMessage();
    },[selectedUser])
}

export default useGetAllMessage;