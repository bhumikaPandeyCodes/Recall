
import HomeIcon from "@/icons/homeIcon"
import { ReactElement } from "react"
export default function SidebarItem({icon, text}: {icon:ReactElement, text: string}){
    return(
        <div className="flex gap-4 py-2 pl-14 items-center hover:bg-slate-50 hover:cursor-pointer group rounded-sm">
               {icon}
                <span className="text-lg font-medium text-gray-600 group-hover:font-semibold group-hover:text-black">{text}</span>
            </div>
    )
}