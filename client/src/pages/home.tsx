
import blob1 from "../assets/blob1SVG.svg"
import cornerSVG1 from "../assets/corner1.svg"
import cornerSVG2 from "../assets/corner2.svg"
import ArrowIcon from "@/icons/arrowIcon"
import { useNavigate } from "react-router-dom"
import {easeInOut, motion} from "motion/react"
export default function Home(){
    const navigate = useNavigate()
    return(
        <div className="">

        <div className="h-screen max-w-screen relative" id="home">
            <motion.nav
            initial={{opacity:0,}}
            animate={{opacity:1}}
            transition={{duration:0.3, delay:0.2, ease:easeInOut}}
             className="flex sm:gap-6 md:gap-10 mt-20 md:mt-10 border-[1.4px] border-gray-500 px-8 py-1 rounded-full absolute left-1/2 -translate-x-1/2">
                <span className="font-normal px-2 py-1 cursor-pointer rounded-full transition-all hover:-translate-y-[1.2px] hover:font-medium ease-in-out delay-0 duration-75 text-nowrap "><a href="#home">Home</a></span>
                <span className="font-normal px-2 py-1 cursor-pointer rounded-full transition-all hover:-translate-y-[1.2px] hover:font-medium ease-in-out delay-0 duration-75 text-nowrap "><a href="#about">About</a></span>
                <span className="font-normal px-2 py-1 cursor-pointer  rounded-full transition-all hover:-translate-y-[1.2px] hover:font-medium ease-in-out delay-0 duration-75 text-nowrap " onClick={()=>navigate("/signup")}>Get Started</span>
            </motion.nav>
            <img src={cornerSVG2} className="rotate-x-90 absolute right-0  w-40 md:w-60 lg:w-80 transform -scale-x-100" />
            {/* <img src={cornerSVG1} className="rotate-180 absolute h-60 right-0 lg:-top-[260px]  " /> */}
            <img src={blob1} className="absolute top-[180px] left-[80px]  sm:left-[200px] sm:top-[160px] lg:left-[160px] lg:top-[80px] w-20 sm:w-24 md:w-28" />
            <motion.div
            initial={{opacity:0,}}
            animate={{opacity:1}}
            transition={{duration:0.7, delay:0.2, ease:easeInOut}}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 text-center">
                <h1 className="text-4xl sm:text-6xl font-normal font-headFont ">Recall</h1>
                <p className="text-md sm:text-lg">where you carefree keep  your ideas</p>
            </motion.div>
            <img src={blob1} className="absolute right-[100px] bottom-[120px] sm:bottom-[100px] w-24 sm:w-28 md:w-36 lg:w-40 rotate-90 " />
            <img src={cornerSVG1} className=" absolute left-0  w-40 md:w-60 lg:w-80 -bottom-[108px]  md:-bottom-[168px] lg:-bottom-[224px]" />
        </div>
        <div className="h-screen absolute overflow-hidden w-screen ">
            <img src={blob1} className="absolute right-10 top-20 sm:right-44 sm:top-32 w-24 md:w-28 "/>
            <div className="h-full absolute overflow-hidden top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] w-full flex flex-col justify-center items-center py-10" id="about">
                <h1 className="font-semibold text-3xl sm:text-4xl text-center mb-6 " >About us</h1>
                <div className="w-[360px] sm:w-[480px] my-5 text-sm sm:text-base">
                    <p >With Recall, you can create your own personalized space to store and categorize important social media posts, links, and videos. Everything stays neatly organized and easily accessible whenever you need it. Plus, you can share your space with others, making collaboration and content discovery effortless.</p>
                    <p className="mt-8 ">Say goodbye to endless scrolling and searching—just save, organize, and recall.</p>
                </div>
            <img src={blob1} className="absolute left-4 sm:left-16 bottom-20 md:left-20 md:bottom-24 w-24 md:w-32 -rotate-180"/>
                <button className="mt-2 border-[1.4px] border-gray-500 px-4 md:px-6 py-1 rounded-full flex items-center gap-2 transition-all hover:bg-black hover:text-white duration-300 hover:gap-4 "
                onClick={()=>navigate("/signup")}>
                    Get Started <ArrowIcon />
                </button>            
                <img src={cornerSVG2} className="rotate-180 absolute bottom-0 right-0 w-40 md:w-60 lg:w-80" />
            </div>
        </div>
        </div>
    )
}