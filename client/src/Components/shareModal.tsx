import CrossIcon from "@/icons/crossIcon"
import { SetStateAction, useState } from "react"


interface shareModalProps{
    setShare: React.Dispatch<SetStateAction<boolean>>,
    shareLink: string,
    error: string
}

export default function ShareModal({setShare, shareLink, error}:shareModalProps){
    const [popup,setPopup] = useState(false)

    function CopyLink(){
        setPopup(true)
        navigator.clipboard.writeText(shareLink)
        setTimeout(()=>
            setPopup(false)
        , 1000)
    }

    return(
        <div className="flex flex-col gap-6 bg-white border-[1.4px] border-gray-500 w-[400px] h-[150px] rounded-md p-2">
            <div className="self-end cursor-pointer" onClick={()=>setShare(false)}>
                <CrossIcon size={6} color="black"/>
            </div>
            {shareLink ? <div className="flex gap-1 justify-center items-center">
                <p 
                onClick={CopyLink}
                className=" px-2 py-1 border-[1.2px] border-gray-500 rounded-sm text-wrap">
                    {shareLink}
                </p>
                <button onClick={CopyLink} className="border-[1.4px] border-gray-500 px-2 py-1 rounded-md bg-white hover:bg-gray-200 ">{popup?"Copied":"Copy"}</button>
             </div>: <p className="w-full text-center text-gray-500 text-base text-wrap">{error}</p>}
        </div>
    )
}