import ContentModal from "@/Components/contentModal";
import MainPanel from "@/Components/MainPanel";
import ShareModal from "@/Components/shareModal";
import Sidebar from "@/Components/Sidebar";
import { BACKEND_URL, FRONTEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";

export type contentTypes = "all" | "Tweet" | "Youtube" | "Link" 

export default function Dashboard(){
  const [addContent, setAddContent] = useState(false)
  const [share, setShare] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [error, setError] = useState("")
  const [viewContent, setViewContent] = useState<contentTypes>("all")
  const [viewSidebar, setViewSidebar] = useState(false)
  

  async function shareContent(){
    const authorization = localStorage.getItem("authorization")
    try{
      const response = await axios.post(BACKEND_URL+"/api/v1/content/share",{share} ,{
        headers:{authorization}
      })
      const serverResponse = response.data
      if(serverResponse.success==false){
        setError("No content here to be shared!")
      }
      else if(serverResponse.success==true){
        setShareLink(FRONTEND_URL+"share"+response.data.link)
      }
    }
    catch(error){
      // console.log(error)
    }
  }

  useEffect(()=>{
    if(share){
      shareContent()
      // console.log("share content enabled")
      // console.log(shareLink)
    }
    // console.log(viewContent)
    // console.log("share button is clicked ")
  },[share])

    return(
       <div className={`h-screen relative ${addContent &&"bg-gray-400" || share && "bg-gray-400" } overflow-x-hidden ${(addContent||share) ? "overflow-y-hidden":""}`}>
          <div className="h-screen flex gap-4 absolute top-0 l-0 ">
            <Sidebar viewSidebar={viewSidebar} setViewSidebar={setViewSidebar} setViewContent={setViewContent}/>
             <MainPanel addContent={addContent} viewSidebar={viewSidebar} setViewSidebar={setViewSidebar} setAddContent={setAddContent} share={share} setShare={setShare} viewContent={viewContent}/>
          </div>
            
          {(addContent|| share) && <div className="h-full w-full  bg-black relative top-0 l-0 opacity-20"> </div>}
            { addContent && <div className="absolute left-[50%] top-[50%]  -translate-x-[50%] -translate-y-[50%] bg-white justify-center items-center rounded-md ">
                                <ContentModal setAddContent={setAddContent} />
                            </div>}
            {share && <div className=" absolute left-[50%] top-[50%]  -translate-x-[50%] -translate-y-[50%] bg-white rounded-md">
                                <ShareModal setShare={setShare} shareLink={shareLink} error={error}/>
                      </div>}
            
       </div>
    )
}