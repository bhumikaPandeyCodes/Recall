import Input from "@/ui/Input";

export  default function Signup(){

    return(
        <div className="h-screen w-screen flex justify-center items-center overflow-hidden">

        <div className=" w-64 h-[360px] py-4 flex flex-col  items-center gap-2 border-[1.6px] border-gray-500  rounded-md">
            <p className="text-xl font-semibold">Signup</p>
            <Input type="text" placeholder="Email"/>
            <Input type="text" placeholder="Username"/>
            <Input type="password" placeholder="Password"/>
            <div className="mt-3 ">
                <button className="px-2 py-1 border-[1.6px] border-gray-500 rounded-md">Create Account</button>
            </div>
            <p className="text-gray-500 text-sm">Already have account? <a href="/signin" className="text-gray-600 underline cursor-pointer">Login</a></p>
        </div>
        </div>
    )
}