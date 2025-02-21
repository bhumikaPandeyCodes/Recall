import { SetStateAction, useEffect, useState } from "react"

interface addTagProps {
    tags: string[], 
    selectedTags: string[],
    setSelectedTags: React.Dispatch<SetStateAction<string[]>>

}

export default function AddTag({tags,selectedTags , setSelectedTags}:addTagProps){

    const [showTags, setShowTags] = useState(false)
    const [selectedTag, setSelectedTag] = useState<string[]>([])
    const [newTag, setNewTag] = useState("")

    function addNew(){

        if(!selectedTag.includes(newTag)){
            setSelectedTag((prevTag)=>[...prevTag, newTag])
        }
        else{
            console.log("already selected")

        }
        //when new tag is added then add back in db
        if(!tags.includes(newTag)){
            tags.push(newTag)
        }
        console.log(tags)


        console.log(selectedTag)
    }

    function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
        // if(e.target.value)
        //     setNewTag(e.target.value)
        // setSelectedTag((prevTag)=>[...prevTag, newTag])
    }   

    function detectClick (e:MouseEvent) {
            console.log("click detected")
            const target = e.target as HTMLInputElement
            if(target.id!="tag-input")
                setShowTags(false)
        }

    useEffect(()=>{
       {showTags && document.body.addEventListener('click',detectClick )}
    },[showTags])

    return(
        <div className=" w-full flex justify-center">
            <div className="relative">
               <input type="text" 
                    id="tag-input"
                    placeholder="Enter  tag"
                    value={newTag}
                    onChange={(e)=>setNewTag(e.target.value)} 
                    className="border-[1.4px] border-gray-500 pl-2 w-[calc(100%-12px)] outline-none rounded-sm"
                    onClick={()=>setShowTags(true)}
                    /> 
               {showTags && <Tags tags={tags} setNewTag={setNewTag} />}
            </div>
               <div className="cursor-pointer rounded-full border-[1.4px] bg-gray-50 border-black w-7 h-7  text-lg font-semibold text-center"
               onClick={addNew}>+
               </div>
        </div>
    )
}

interface TagProps{
    tags: string[],
    setNewTag: (tag: string)=>void
}

function Tags({tags, setNewTag}:TagProps) {
        return (
            <div className="flex flex-col shadow-md rounded-md absolute z-10 bg-white w-[calc(100%-8px)]">
                {
                    tags.map((tag, key)=>
                        <span 
                           key={key}
                           className="px-2 py-[2px] hover:bg-slate-100 cursor-pointer"
                           onClick={()=>setNewTag(tag)}>
                             {tag}
                        </span>
                    )  
                }
                
            </div>
        )
}