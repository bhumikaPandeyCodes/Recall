import React from "react"

interface InputProps {
    type:"text" | "password",
    placeholder?: string,
    required?:boolean,
    reference?: React.RefObject<HTMLInputElement>,
    name?: string,
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void,
    suffix?: React.ReactNode
}

export default function Input({type, placeholder, required, reference,name ,onChange, suffix}: InputProps){
    return (
        <div className="relative w-full ">
            <input
                ref={reference}
                className={`w-full border-b-[1.6px] border-gray-500 outline-none mt-2 px-2 text-sm py-[2px] ${suffix ? "pr-12" : ""}`}
                type={type}
                placeholder={placeholder}
                required={required}
                name={name}
                onChange={onChange}
            />
            {suffix && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    {suffix}
                </div>
            )}
        </div>
    )
}