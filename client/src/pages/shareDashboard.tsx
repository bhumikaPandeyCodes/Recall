import ContentModal from "@/Components/contentModal";
import MainPanel from "@/Components/MainPanel";
import ShareModal from "@/Components/shareModal";
import SharePanel from "@/Components/sharePanel";
import Sidebar from "@/Components/Sidebar";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ShareDashboard(){
    const [shareLink, setShareLink] = useState("")
    const [error, setError] = useState("")

    return(
       <div className={`h-screen flex gap-4  overflow-x-hidden`}>
            <SharePanel/>    
        </div>
            
    )
}