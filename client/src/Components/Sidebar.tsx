import HomeIcon from "@/icons/homeIcon";
import SidebarItem from "./SidebarItem";
import TweetIcon from "@/icons/tweetIcon";
import VideoIcon from "@/icons/videoIcon";
import DocumentIcon from "@/icons/documentIcon";
import LinkIcon from "@/icons/linkIcon";
import TagIcon from "@/icons/tagsIcon";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import React, { SetStateAction, useEffect, useState } from "react";
import UserIcon from "@/icons/userIcon";
import { blob } from "stream/consumers";
import { url } from "inspector";
import { contentTypes } from "@/pages/dashboard";
import CrossIcon from "@/icons/crossIcon";

type UserType = {
username: string,
email: string,
image: string

}

interface SidebarProps{
    setViewContent: React.Dispatch<SetStateAction<contentTypes>>,
    viewSidebar: boolean,
    setViewSidebar: React.Dispatch<SetStateAction<boolean>>
}

export default function Sidebar({setViewContent, viewSidebar, setViewSidebar}:SidebarProps){

    const [userInfo, setUserInfo] = useState<UserType | null>(null)

    async function getUserDetails(){
        const authorization = localStorage.getItem("authorization")
        try {
            
            const response = await axios.get(BACKEND_URL+"/api/v1/user-info",{
                headers: {authorization},
                
            })
            // const {username,email} = response.data
            const userdata = response.data
            const username = userdata.username
            const email = userdata.email

            const imgBuffer = new Uint8Array(userdata.image.data)
            const imageBlob = new Blob([imgBuffer], {type: "img/png"})
            const image = URL.createObjectURL(imageBlob)
            setUserInfo({username,email,image})

        } catch (error) {
            if(axios.isAxiosError(error)){
                //setError(error.response.data.message)
                console.log(error)   
            }
        }
    }

    useEffect(()=>{
        getUserDetails()
        // console.log(userInfo)
    },[])

    return(
        <div className={`h-full ${viewSidebar?"flex flex-col":"hidden"} shadow-lg  w-40 sm:w-56 md:w-72 p-3 sm:flex sm:flex-col gap-5`}>
            <div className="flex justify-between sm:inline-block"> 
                <span className="font-headFont font-medium text-lg md:text-2xl ">
                    Recall
                </span>
                {
                    viewSidebar && <div className="sm:hidden" onClick={()=>setViewSidebar(false)}>
                    <CrossIcon size={6} color={"black"} />
                    </div>
                }
            </div>
            <div className="flex flex-col mb-4 items-center">
                <div className="h-14 w-14 border-[1.4px] border-gray-500 rounded-full flex items-center justify-center">
                    {userInfo?.image ? <img src={userInfo.image} className="h-14 w-14 aspect-auto object-cover rounded-full"/> 
                    : <UserIcon color="gray-500" size={8} />}
                </div>
                
                <span className="font-semibold text-base md:text-lg">{userInfo?.username}</span>
                <span className="text-gray-400 text-xs md:text-sm">{userInfo?.email}</span>
            </div>
            <div className=" flex flex-col gap-3 justify-start ">
                <SidebarItem icon={< HomeIcon/>} text="Dashboard" type={"all"} setViewContent={setViewContent}/>
                <SidebarItem icon={< TweetIcon/>} text="Tweet" type={"Tweet"} setViewContent={setViewContent}/>
                <SidebarItem icon={< VideoIcon/>} text="Videos" type={"Youtube"} setViewContent={setViewContent}/>
                <SidebarItem icon={< LinkIcon/>} text="Links" type={"Link"} setViewContent={setViewContent}/>
                {/* <SidebarItem icon={< TagIcon/>} text="Tags" setViewContent={setViewContent}/> */}
            </div>
           
        </div>
    )
}
