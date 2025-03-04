import { ReactElement } from "react"

interface ButtonProps{
    variant: "primary" | "secondary",
    type?: "submit" | "reset" | "button",
    startIcon?: ReactElement,
    text: string,
    onClick?: ()=>void,
    paddingX?: number
}

const ButtonVariant ={
    "primary": "bg-black px-2 py-1 text-white",
    "secondary": "bg-inherit px-2 py-1 text-black"
}
const defaultStyle = "  border-[1.4px] font-normal border-black rounded-md flex items-center gap-1 transition-all hover:-translate-y-[1px] text-sm md:text-normal "

export default function Button({variant,type ,startIcon, text, onClick, paddingX}: ButtonProps){
    return(
        <button type={type} className={`${ButtonVariant[variant]} ${defaultStyle} px-${paddingX}`} onClick={onClick}>
            {startIcon}
            {text}
        </button>
    )
}
