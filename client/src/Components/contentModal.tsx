import Input from "@/ui/Input";
import CrossIcon from "../icons/crossIcon";
import AddTag from "@/ui/addTag";
import Button from "@/ui/Button";
import Tag from "@/ui/tag";
import { SetStateAction, useState } from "react";

interface contentModalProps{
    setAddContent: React.Dispatch<SetStateAction<boolean>>
}

export default function ContentModal({setAddContent}: contentModalProps){

    let tags = ["productivity", "self-care"]
    let types = ["Link", "Video", "Socials", "Document"]
    const [selectedTag, setSelectedTag] = useState<string[]>([])


    return (
      <div className="w-[350px] h-[400px] border-[1.4px] border-gray-500 rounded-md p-2">
        <div className="flex justify-end">
            <button onClick={()=>setAddContent(false)}>
                <CrossIcon />
            </button>
        </div>
        <div className="px-10">
            <form className=" p-2 flex flex-col gap-5 items-start mt-5">
                <div className="flex items-end gap-2">
                    <label className="font-medium" htmlFor="title">Title: </label>
                    <Input type="text" required={true}/>
                </div>
                <div className="flex items-end gap-2">
                    <label className="font-medium" htmlFor="link">Link: </label>
                    <Input type="text" required={true}/>
                </div>
                <div className="flex items-end gap-2 mt-2">
                    <label className="font-medium" htmlFor="type">Type: </label>
                    <select className="border-[1.4px] border-gray-500 pl:2 sm:pr-16 py-[2px] rounded-sm outline-none text-sm text-start" name="Type" required={true}>
                        {types.map((type, key)=>{   
                           return <option key={key} value={type}>{type}</option>
                          })
                        }
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex  gap-2 mt-2">
                    <label className="font-medium " htmlFor="Tags">Tags: </label>
                    <AddTag tags={tags} selectedTags={selectedTag} setSelectedTags={setSelectedTag}/>
                    </div>
                    <div className="ml-12 flex flex-wrap gap-2 ">
                        <Tag tag="tag1"/>
                        <Tag tag="tag1"/>
                        <Tag tag="tag1"/>
                        <Tag tag="tag1"/>
                    </div>
                </div>
                <div className="self-center">
                    <Button type="primary" text="Add" />
                </div>
            </form>
        </div>

      </div>

    )
}