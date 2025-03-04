import CrossIcon from "@/icons/crossIcon";

interface TagProps{
    tag: string,
    // key: number,
    id:number,
}

export default function Tag({tag, id}: TagProps) {
    return (
        <span className=" flex justify-center items-center gap-2 px-1 py-[.8px] rounded-md border-[1.2px] border-black cursor-default">#{tag}
        </span>
    )

}