import CrossIcon from "@/icons/crossIcon"
import React, { SetStateAction } from "react"

interface TagContainerProps{
    selectedTag: string[],
    setSelectedTag: React.Dispatch<SetStateAction<string[]>>
}


export default function TagContainer({selectedTag ,setSelectedTag}: TagContainerProps){
    function handleRemove(tagId: number){
    
        setSelectedTag((prevState)=>prevState.filter((_, id)=>id!=tagId) )
    }
    return(
        <div className=" flex flex-wrap gap-2 ">
                    {selectedTag && selectedTag.map((tag, id)=> {return (
                         <span key={id} className=" flex justify-center items-center gap-2 px-1 py-[.8px] rounded-md border-[1.2px] border-black cursor-default">#{tag}
                                    <button onClick={()=>handleRemove(id)}>{<CrossIcon size={4} color="gray"/>}</button>
                            </span>
                    )})}
        </div>
    )
}