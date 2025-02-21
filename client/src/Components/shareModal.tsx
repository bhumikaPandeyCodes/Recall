import CrossIcon from "@/icons/crossIcon"
import { SetStateAction, useState } from "react"


interface shareModalProps{
    setShare: React.Dispatch<SetStateAction<boolean>>
}

export default function ShareModal({setShare}:shareModalProps){

    const [shareLink, setShareLink] = useState("https://recall.com/fghbv776r")

    function CopyLink(){
        ()=>navigator.clipboard.writeText(shareLink)
    }

    return(
        <div className="flex flex-col gap-6 bg-white border-[1.4px] border-gray-500 w-[350px] h-[150px] rounded-md p-2">
            <div className="self-end cursor-pointer" onClick={()=>setShare(false)}>
                <CrossIcon/>
            </div>
            <div className="flex gap-1 justify-center items-center">
                <p 
                onClick={CopyLink}
                className=" px-2 py-1 border-[1.2px] border-gray-500 rounded-sm">
                    {shareLink}
                </p>
                <button className="border-[1.4px] border-gray-500 px-2 py-1 rounded-md bg-gray-200 hover:bg-white ">Copy</button>
             </div>
        </div>
    )
}