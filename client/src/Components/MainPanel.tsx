import AddIcon from "@/icons/addIcon"
import Button from "@/ui/Button"
import ShareIcon from "@/icons/shareIcon"
import React, { SetStateAction, useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import { contentTypes } from "@/pages/dashboard"
import DisplayContent from "./displayContents"
import MenuIcon from "@/icons/hamburgerIcon"

interface mainPanelProps{
  addContent: boolean,
  setAddContent: React.Dispatch<SetStateAction<boolean>>
  share: boolean,
  setShare: React.Dispatch<SetStateAction<boolean>>
  viewContent: contentTypes,
  viewSidebar: boolean,
  setViewSidebar: React.Dispatch<SetStateAction<boolean>>
}

export type TagsType = {
  name: string,
  _id: string
}

export type ContentsType = {
  link: string,
  tags: TagsType[],
  title: string
  type: string,
  _id: string,
  createdAt: string
}


const MainPanel = ({addContent, setAddContent, share, setShare, viewContent, viewSidebar, setViewSidebar}: mainPanelProps) => {

  const [contents, setContents] = useState<ContentsType[] | null>(null)
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("")
  const authorization = localStorage.getItem("authorization")

  function handleAddContent(){
    setAddContent(true)
    setShare(false)
  }

  function handleShareContent(){
    setShare(true)
    setAddContent(false)
  }
  

  async function showContent(){
    try{
      console.log(viewContent)
        const response = await axios.get(BACKEND_URL+`/api/v1/content?type=${viewContent}`,{headers: {authorization}})
        // console.log(response)
        if(response.data){

          if(response.data.foundContents.length>0){

            setContents(response.data.foundContents)
            setUsername(response.data.username)
          }
          else{
            setContents(null)
                setUsername(response.data.username)
                setMessage("No contents found")
              }
           }

    }
    catch(error){
      console.log(error)
    }
  }
async function deleteContent(id: string){
  console.log(id)
  try{
    const response = await axios.delete(BACKEND_URL+"/api/v1/content",{
      headers:{authorization},
      data: {contentId: id}
    })
    if(response.data.success==true)
      location.reload()
  }
  catch(error){
    console.log(error)
  }

}

  useEffect(()=>{
  showContent()
  console.log(contents)
  },[viewContent])


  return (
    <div className={`h-full w-screen sm:w-[calc(100vw-20rem)] py-4 px-3 ${(addContent || share)&&"overflow-y-hidden"}`}>
     
        <div className={`${!viewSidebar?"block":"hidden" } sm:block`}>
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between">
          {
            !viewSidebar && <div className="sm:hidden block" onClick={()=>setViewSidebar(true)}>
            <MenuIcon />
            </div>
          }
            <span className="font-semibold text-lg md:text-xl text-center md:text-left sm:w-full">{username}'s Board</span>
            <div className="flex gap-2 self-end justify-around w-full md:justify-end">
                <Button onClick={handleAddContent} variant="primary" text="Add content" startIcon={<AddIcon/>} />
                <Button onClick={handleShareContent} variant="secondary" text="Share" startIcon={<ShareIcon/>} />
            </div>
        </div>
        <div className="mt-10 sm:mt-20">
          <DisplayContent authorize={true} contents={contents} message={message} deleteContent={deleteContent}/>
        </div>
       </div>
    </div>
  )
}

export default MainPanel
