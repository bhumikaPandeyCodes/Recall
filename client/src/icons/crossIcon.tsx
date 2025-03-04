

export default function CrossIcon({size, color}:{size:number, color: string}){

    const colorClasses: {[key: string]: string} = {
        black: "stroke-black",
        gray: "stroke-gray-500"
    }

    const sizeClasses:{[key:number]: string} = {
        1: "4px",
        2: "8px",
        4: "16px",
        6: "24px"
    }

    return(
        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" strokeWidth="1.5" width={sizeClasses[size]} height={sizeClasses[size]} className={`${colorClasses[color]} rounded-sm hover:stroke-black hover:bg-gray-50`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>

    )
}