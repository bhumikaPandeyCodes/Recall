import HomeIcon from "@/icons/homeIcon";
import SidebarItem from "./SidebarItem";
import SocialsIcon from "@/icons/socialsIcon";
import VideoIcon from "@/icons/videoIcon";
import DocumentIcon from "@/icons/documentIcon";
import LinkIcon from "@/icons/linkIcon";
import TagIcon from "@/icons/tagsIcon";

export default function Sidebar(){
    return(
        <div className="h-full  shadow-lg mb-5  w-72 p-3 flex flex-col gap-5">
            <div className="inline-block"> 
                <span className="font-headFont font-medium text-2xl ">
                    Recall
                </span>
            </div>
            <div className="flex flex-col mb-4 items-center">
                <span className="inline-block bg-gray-300 rounded-full w-14 h-14 mb-3"></span>
                <span className="font-semibold text-lg">Sarah Conner</span>
                <span className="text-gray-400 text-sm">sarahc@gamil.com</span>
            </div>
            <div className=" flex flex-col gap-3">
                <SidebarItem icon={< HomeIcon/>} text="Dashboard"/>
                <SidebarItem icon={< SocialsIcon/>} text="Socials"/>
                <SidebarItem icon={< VideoIcon/>} text="Videos"/>
                <SidebarItem icon={< DocumentIcon/>} text="Document"/>
                <SidebarItem icon={< LinkIcon/>} text="Links"/>
                <SidebarItem icon={< TagIcon/>} text="Tags"/>
            </div>
           
        </div>
    )
}
