import { ReactElement } from "react"

interface ButtonProps{
    type: "primary" | "secondary",
    startIcon?: ReactElement,
    text: string,
    onClick?: ()=>void
}

const ButtonVariant ={
    "primary": "bg-inherit px-2 py-1 text-black",
    "secondary": "bg-gray-200 px-2 py-1 text-black"
}

const defaultStyle = "border-[1.4px] font-normal border-black rounded-md flex items-center gap-1 hover:bg-gray-100"

export default function Button({type, startIcon, text, onClick}: ButtonProps){
    return(
        <button className={`${ButtonVariant[type]} ${defaultStyle}`} onClick={onClick}>
            {startIcon}
            {text}
        </button>
    )
}