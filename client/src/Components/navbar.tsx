
import { useNavigate } from "react-router-dom"

export default function Navbar(){
    const navigate = useNavigate()
    return (
    <nav className=" flex gap-10 mt-10 border-[1.4px] border-gray-500 px-8 py-1 rounded-full fixed left-1/2 -translate-x-1/2 backdrop-filter backdrop-blur-3xl bg-opacity-90">
        <span className="font-normal px-2 py-1 cursor-pointer rounded-full transition-all hover:-translate-y-[1.2px] hover:font-medium ease-in-out  text-nowrap ">Home</span>
        <span className="font-normal px-2 py-1 cursor-pointer rounded-full transition-all hover:-translate-y-[1.2px] hover:font-medium ease-in-out  text-nowrap "><a href="#about">About</a></span>
        <span className="font-normal px-2 py-1 cursor-pointer  rounded-full transition-all hover:-translate-y-[1.2px] hover:font-medium ease-in-out  text-nowrap " onClick={()=>navigate("/signup")}>Get Started</span>
    </nav>
    )
}