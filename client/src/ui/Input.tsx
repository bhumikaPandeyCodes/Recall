import React from "react"

interface InputProps {
    type:"text" | "password",
    placeholder?: string,
    required?:boolean,
    reference?: React.RefObject<HTMLInputElement>,
    name?: string,
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void
}


export default function Input({type, placeholder, required, reference,name ,onChange}: InputProps){
    return (
        <input
         ref={reference}
         className="border-b-[1.6px] border-gray-500 outline-none mt-2 px-2 text-sm py-[2px]"
         type={type}
         placeholder={placeholder}
         required={required}
         name={name}
         onChange={onChange}/>
    )
}