import { ReactElement, useEffect, useState } from "react"
import Dashboard from "./pages/dashboard"
import ImageUpload from "./pages/imageUpload"
import ShareDashboard from "./pages/shareDashboard"
import Signin from "./pages/signin"
import Signup from "./pages/signup"
import {BrowserRouter,Routes, Route, Navigate} from 'react-router-dom'
import PageNotFound from "./pages/pagenotfound"
import Home from "./pages/home"
const App = () => {
  const [hash, setHash] = useState("")

  useEffect(()=>{

    if(window.location.pathname.includes('share')){
      const pathArray = window.location.pathname.split('/')
      const lastId = pathArray.pop()
      if(lastId){
        setHash(lastId)
      }
    }
  }, [])

  return (
    <BrowserRouter>
    <Routes >
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
        <Route path="/upload-image" element={<ProtectedRoute element={<ImageUpload />} />} />
       <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path={`/share/${hash}`} element={<ShareDashboard />} />
      <Route path="*" element={<PageNotFound/>} />
    </Routes>
    </BrowserRouter>
  )
}

function ProtectedRoute({element}:{element: ReactElement}){
  const isAuthorized = !!localStorage.getItem("authorization")
  return isAuthorized? element : <Navigate replace to={"/"} />
}

export default App
