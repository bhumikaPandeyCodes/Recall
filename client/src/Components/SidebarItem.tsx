
import HomeIcon from "@/icons/homeIcon"
import { contentTypes } from "@/pages/dashboard"
import React, { ReactElement, SetStateAction } from "react"

interface SidebarItemProps {
    icon: ReactElement,
    text: string,
    type: contentTypes,
    setViewContent: React.Dispatch<SetStateAction<contentTypes>>
}

export default function SidebarItem({icon, text,type ,setViewContent}: SidebarItemProps){
    return(
        <div className="flex gap-4 py-2 pl-3 sm:pl-7 md:pl-14 items-center hover:bg-slate-50 hover:cursor-pointer group rounded-sm" onClick={()=>setViewContent(type)}>
               {icon}
                <span className=" text-base md:text-lg font-medium text-gray-600 group-hover:font-semibold group-hover:text-black">{text}</span>
        </div>
    )
}