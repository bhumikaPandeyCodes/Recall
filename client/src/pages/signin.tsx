import Input from "@/ui/Input";
import { BACKEND_URL } from "@/config";
import { useRef, useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import blob1 from "../assets/blob1SVG.svg"
import {easeIn, motion} from "motion/react"

export  default function Signin(){

    const userIdentityRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
   async function handleSignup(){
        try{
            setIsLoading(true)
            if(userIdentityRef.current && passwordRef.current){
                

                if(userIdentityRef.current.value && passwordRef.current.value){
                    const [userIdentity, password] = [userIdentityRef.current.value, passwordRef.current.value]

                    const response = await axios.post(BACKEND_URL+"/api/v1/signin",{
                        userIdentity,password
                    })
                    if(response.status===200){
                        setError("")
                        // console.log(response.data)
                        if(response.data.token){
                            localStorage.setItem("authorization",response.data.token)
                        }
                        navigate("/dashboard")
                    }
                    else{
                        setIsLoading(false)
                        setError("username/ email or password is incorrect")
                    }

                }
                else{
                    setIsLoading(false)
                    setError("please enter all the fields")
                }
                
            }
        }
        catch(error){
            setIsLoading(false)
            if(axios.isAxiosError(error))
             setError(error.response?.data?.error)
            else{
                setError("an error occured")
            }
            console.log(error)

        }
    }


    return(
        <div
        className="h-screen w-screen flex justify-center items-center overflow-hidden absolute">
            <img src={blob1} className="md:absolute md:top-[25%] md:left-[20%] md:scale-90 md:block hidden"/>
            <motion.div
            initial={{opacity:0,}}
            animate={{opacity:1}}
            transition={{duration:0.4, delay:0.2, ease:easeIn}}
            className=" w-64 h-[360px] py-4 flex flex-col  items-center gap-4 border-[1.6px] border-gray-500  rounded-md">
                <p className="text-2xl font-medium font-headFont">Signin</p>
                <Input reference={userIdentityRef} type="text" placeholder="Username" onChange={()=>setError("")}/>
                <Input reference={passwordRef} type="password" placeholder="Password" onChange={()=>setError("")}/>
                <div className="mt-3 ">
                    <button className={`px-2 py-1 border-[1.6px] border-gray-500 rounded-md bg-black text-white   ${isLoading && "animate-pulse"} duration-1000`} onClick={handleSignup}>Login</button>
                </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p> }
                <p className="text-gray-500 text-sm">Don't have account? <a href="/signup" className="text-gray-600 underline cursor-pointer">Signup</a></p>
            </motion.div>
        <img src={blob1} className="md:absolute md:bottom-[20%] md:right-[16%] md:scale-110 md:rotate-90 md:block hidden"/>
        </div>
    )
}