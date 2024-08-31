import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Signup from './components/ui/Signup'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { Route } from 'lucide-react'
import MainLayout from './components/ui/MainLayout'
import Home from './components/ui/Home'
import Login from './components/ui/Login'
import Profile from './components/ui/Profile'


const browserRouter = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children: [{
      path:"/",
      element:<Home/>,
    },
    {
      path:"/profile",
      element:<Profile/>,
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
  

  return (
    <>
     <RouterProvider router={browserRouter}/>
    </>
  )
}

export default App
