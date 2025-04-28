import Input from "@/ui/Input";
import CrossIcon from "../icons/crossIcon";
import AddTag from "@/ui/addTag";
import Button from "@/ui/Button";
import React, { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import TagContainer from "./tagContainer";

interface contentModalProps{
    setAddContent: React.Dispatch<SetStateAction<boolean>>
}

type newContentType = {
    type: string,
    title: string,
    link: string,
    tags: string[]
}

export default function ContentModal({setAddContent}: contentModalProps){

    let types = ["Link", "Youtube", "Tweet", "Document"]
    const [newContent, setNewContent] = useState<newContentType>({type: "Link", title:"", link:"",tags:[]})
    const [tags, setTags] = useState<string[] |null>(null)
    const [selectedTag, setSelectedTag] = useState<string[]>([])
    const [authorization, _] = useState<string | null>(localStorage.getItem("authorization"))
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function getTags(){
        try{

            if(authorization){

                const response = await axios.get(BACKEND_URL+"/api/v1/get-tags",{
                    headers:{authorization}
                })
                if(response.status==200){
                    setTags(response.data.tags)
                }

            }

        }
        catch(error){
            console.log(error)
        }
    }

    function handleChange(e: React.FormEvent<HTMLInputElement |HTMLSelectElement>){
        const name = e.currentTarget.name
        const value = e.currentTarget.value
        // console.log(name)
        // console.log(value)
            setNewContent(prevVal=>({...prevVal, [name]: value}))
        
    }

    async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        setIsLoading(true)
        e.preventDefault()
        try{    
            const authorization = localStorage.getItem("authorization")
            const response = await axios.post(BACKEND_URL+"/api/v1/add-content", {newContent},{
                headers: {authorization}
            })
            console.log(response)
            if(response.data.success == true)
                location.reload()
            else{
                setIsLoading(false)
                setError("Couldn't upload. Try again")
            }
            // console.log(newContent)

        }
        catch(error){
            setIsLoading(false)
            console.log(error)
        }

    }


    useEffect(()=>{
        getTags()
        if(selectedTag){
            setNewContent((prevVal)=>({...prevVal, tags: selectedTag}))
        }
    },[selectedTag])


    return (
      <div className={`w-[350px] h-[420px] border-[1.4px] border-gray-500 rounded-md p-2 ${isLoading && "animate-pulse"} bg-gray-50 duration-1000`}>
        <div className="flex justify-end">
            <button onClick={()=>setAddContent(false)}>
                <CrossIcon size={6} color="black"/>
            </button>
        </div>
        <div className="px-10">
            <form className=" p-2 flex flex-col gap-5 items-start mt-5" onSubmit={handleSubmit}>
                <div className="flex items-end gap-2">
                    <label className="font-medium" htmlFor="title">Title: </label>
                    <Input type="text" required={true}  name="title" onChange={handleChange}/>
                </div>
                <div className="flex items-end gap-2">
                    <label className="font-medium" htmlFor="link">Link: </label>
                    <Input type="text" required={true} name="link" onChange={handleChange}/>
                </div>
                <div className="flex items-end gap-2 mt-2">
                    <label className="font-medium" htmlFor="type">Type: </label>
                    <select className="border-[1.4px] border-gray-500 pl:2 sm:pr-16 py-[2px] rounded-sm outline-none text-sm text-start" name="type" required={true} onChange={(e)=>handleChange(e)}>
                        {
                           types.map((type, key)=>{   
                           return <option key={key} value={type}>{type}</option>
                          })
                        }
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex  gap-2 mt-2">
                    <label className="font-medium " htmlFor="Tags">Tags: </label>
                    <AddTag tags={tags} selectedTags={selectedTag} setSelectedTags={setSelectedTag} setError={setError}/>
                    </div>
                    <TagContainer selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
                        <p className="text-gray-500 text-base">{error}</p>
                </div>
                <div className="self-center">
                    <Button variant="primary" type="submit" text="Add" paddingX={6} />
                </div>
            </form>
        </div>

      </div>

    )
}