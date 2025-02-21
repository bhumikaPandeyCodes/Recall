
interface InputProps {
    type:"text" | "password",
    placeholder?: string,
    required?:boolean
}


export default function Input({type, placeholder, required}: InputProps){
    return (
        <input className="border-b-[1.6px] border-gray-500 outline-none mt-2 px-2 text-sm py-[2px]" type={type} placeholder={placeholder} required={required}/>
    )
}