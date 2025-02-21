import MainPanel from "@/Components/MainPanel";
import Sidebar from "@/Components/Sidebar";
import { useState } from "react";

export default function Dashbaord(){
  const [addContent, setAddContent] = useState(true)
  const [share, setShare] = useState(false)

    return(
       <div className={`h-screen overflow-hidden flex gap-4 ${addContent &&"bg-gray-400" || share && "bg-gray-400" }`}>
            <Sidebar />
            <MainPanel addContent={addContent} setAddContent={setAddContent} share={share} setShare={setShare}/>
       </div>
    )
}