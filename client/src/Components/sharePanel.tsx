
import {  useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "@/config"
import DisplayContent from "./displayContents"

export type TagsType = {
  name: string,
  _id: string
}

type ContentsType = {
  link: string,
  tags: TagsType[],
  title: string
  type: string,
  _id: string,
  createdAt: string
}


const SharePanel = () => {

  const [contents, setContents] = useState<ContentsType[] | null>(null)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")

  async function displayContent(){

    const url = window.location.pathname
    const shareId = url.split('/').pop()
    // console.log(shareId)
    try{
        const response = await axios.get(BACKEND_URL+`/api/v1/content/:${shareId}`)
        console.log(response)
        if(response.data){
          if(response.data.content){
            setContents(response.data.content)
            setUsername(response.data.username)
          }
          else{
            setUsername(response.data.username)
            setMessage("No content found!")
          }
        }
        else{
          setError("Invalid url")
        }
    }
    catch(error){
      console.log(error)
    }
  }
  useEffect(()=>{
  displayContent()
  // console.log(contents)
  },[])


  return (
    <div className={`h-full w-screen py-4 px-3 overflow-y-scroll "}`}>
     

        {error? <div className="w-full text-center text-red-400">{error}</div> :<div>
        <h1 className="font-headFont font-medium text-xl md:text-2xl ">Recall</h1>
          <div className="flex justify-center mt-10">
              <span className="font-semibold text-lg md:text-xl">{username}'s Board</span>
          </div>
        <div className="mt-5 ">
            <DisplayContent authorize={false} contents={contents} message={message}/>
        </div>
       </div>
       }
    </div>
  )
}

export default SharePanel
