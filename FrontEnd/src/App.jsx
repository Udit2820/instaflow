import { useEffect, useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import Signup from './components/ui/Signup'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { Route } from 'lucide-react'
import MainLayout from './components/ui/MainLayout'
import Home from './components/ui/Home'
import Login from './components/ui/Login'
import Profile from './components/ui/Profile'
import EditProfile from './components/ui/EditProfile'
import ChatPage from './components/ui/ChatPage'
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ui/ProtectedRoutes'


const browserRouter = createBrowserRouter([
  {
    path:"/",
    element:<ProtectedRoutes><MainLayout/></ProtectedRoutes>,
    children: [{
      path:"/",
      element:<ProtectedRoutes><Home/></ProtectedRoutes>
    },
    {
      path:"/profile/:id",
      element:<ProtectedRoutes><Profile/></ProtectedRoutes>,
    },
    {
      path:"/account/edit",
      element:<ProtectedRoutes><EditProfile/></ProtectedRoutes>,
    },
    {
      path:"/chat",
      element:<ProtectedRoutes><ChatPage/></ProtectedRoutes>,
    }
  ]
  },
  {
    path:"/login",
    element:<Login/>,
  },
  {
    path:"/signup",
    element:<Signup/>,
  },
])

function App() {
  const {user} = useSelector(store=>store.auth);
  const {socket} = useSelector(store=>store.socketio);
  const dispatch = useDispatch();
  useEffect(()=>{
    if(user){
      const socketio = io('https://instaflow.onrender.com/',{
        query:{
          userId:user?._id,
        },
        transports:['websocket']
      });
      dispatch(setSocket(socketio));

      //listen all the events
      socketio.on('getOnlineUsers',(onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });
      return ()=>{
        socketio.close();
        dispatch(setSocket(null));
      }
    }
    else if(socket){
        socket.close();
        dispatch(setSocket(null));
    }
  },[user, dispatch])

  return (
    <>
     <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
