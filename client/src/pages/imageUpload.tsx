import { BACKEND_URL } from "@/config";
import UserIcon from "@/icons/userIcon";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";


export  default function ImageUpload(){
    const [imgPreview, setImgPreview] = useState<string>("")
    const[img, setImg] = useState<File| null>(null)
    const [addImg, setAddImg] = useState(true)
    const imgRef = useRef<HTMLInputElement>(null)
    const [error,setError] = useState("")
    const formData = new FormData

    const navigate = useNavigate()

    function handleClick(e:React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        setError("")
        console.log("clicked")
        imgRef.current?.click()
        setAddImg(true)
    }

    function handlechange(){
        setError("")
        if(imgRef.current?.files){
            const img = imgRef.current.files[0]
            console.log(imgRef.current.files)
            setImg(img)
            setImgPreview(URL.createObjectURL(img))
        }
    }
    
    async function handleSubmit(e:React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        setError("")
        if(addImg)
        {
            if(formData){

                const authorization = localStorage.getItem("authorization")
                try{
                    
                    const response =await axios.put(BACKEND_URL+"/api/v1/upload-image", formData,{
                            headers: {
                                    authorization,
                                    "content-type":"multipart/form-data"
                                     }
                                }
                            )
                if(response.status==200)
                     navigate("/dashboard")
                else
                    setError("Couldn't upload image. Please try again")
                    
                }
                catch(error){
                    console.log(error)
                }   
            }
            else{
                setError("Couldn't upload image. Please try again")
                console.log("formdata not uplaoded")
            }
        }
        else{
            navigate("/dashboard")
        }

    }

    function handleSkip(e:React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        setError("")
        if(imgRef.current?.files){
            imgRef.current.value = ""
        }
        setAddImg(false)
        setImgPreview("")
    }

    useEffect(()=>{
        if(img)
            formData.append("profile",img)
    },[img])

    return(
        <div className="h-screen w-screen flex justify-center items-center overflow-hidden">

            <div className=" w-64 h-[360px] py-4 flex flex-col  items-center gap-4 border-[1.6px] border-gray-500  rounded-md">
                <p className="text-2xl font-medium font-headFont">Upload Image</p>
                <form className="flex flex-col gap-2 items-center">
                    <div className="h-20 w-20 border-[1.4px] border-gray-500 rounded-full flex items-center justify-center">
                       {imgPreview?<img src={imgPreview} className="h-20 w-20 aspect-auto object-cover rounded-full"/> : <UserIcon color="gray-500" size={12} />}
                    </div>
                    <div className="mt-3 flex gap-2">
                        <div>
                            <input type="file" accept="image/*" className="hidden" ref={imgRef} onChange={handlechange} />
                            <button 
                             onClick={(e)=>handleClick(e)}
                             className={`px-2 py-1 flex-1 whitespace-nowrap min-w-24  border-gray-500 rounded-md ${addImg? "border-[2px]":"border-[1.6px]"}`}
                             >Add Image
                            </button>
                        </div>
                        <button
                         onClick={(e)=>handleSkip(e)}
                         className={`px-2 py-1 flex-1 border-[1.6px] min-w-24 border-gray-500 rounded-md ${!addImg? "border-[2px]":"border-[1.6px]"}`}>
                            Skip
                        </button>
                    </div>
                    {error && <p className="text-red-400">{error}</p>}
                    <button className="px-2 py-1 w-full border-[1.6px] border-gray-500 rounded-md" onClick={(e)=>handleSubmit(e)}>Done</button>
                </form>
            </div>
        </div>
    )
}