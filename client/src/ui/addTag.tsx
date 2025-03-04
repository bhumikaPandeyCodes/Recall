import { stringify } from "querystring"
import { SetStateAction, useEffect, useState } from "react"

interface addTagProps {
    tags: string[] | null, 
    selectedTags: string[],
    setSelectedTags: React.Dispatch<SetStateAction<string[]>>,
    setError: React.Dispatch<SetStateAction<string>>

}

export default function AddTag({tags,selectedTags , setSelectedTags, setError}:addTagProps){

    const [showTags, setShowTags] = useState(false)
    // const [selectedTag, setSelectedTag] = useState<string[]>([])
    const [newTag, setNewTag] = useState("")

    function addNew(){
        
        //check if new input tag already exists in selectedtags
        if(selectedTags.length==4){
            setError("cannot select more than 3 tags")
        }
        else{

            if(!selectedTags.includes(newTag)){
                setSelectedTags((prevTag)=>[...prevTag, newTag])
            }
            else{
                console.log("already selected")
                
            }
        }
        setNewTag("")
        //when new tag is added then add back in db
        // if(!tags.includes(newTag)){
        //     tags.push(newTag)
        // }


    }  

    //Click anywhere dropdown will close
    function detectClick (e:MouseEvent) {
            console.log("click detected")
            const target = e.target as HTMLInputElement
            if(target.id!="tag-input")
                setShowTags(false)
        }

    useEffect(()=>{
        if(showTags)
        document.body.addEventListener('click',detectClick )
        return ()=>{document.body.removeEventListener('click', detectClick)}
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
               {showTags && <DropDownTags tags={tags} newTag={newTag} setNewTag={setNewTag} />}
            </div>
               <div className="cursor-pointer rounded-full border-[1.4px] bg-gray-50 border-black w-7 h-7  text-lg font-semibold text-center"
               onClick={addNew}>+
               </div>
        </div>
    )
}

interface DropDownTagsProps{
    tags: string[] | null,
    newTag: string,
    setNewTag: (tag: string)=>void
}

function DropDownTags({tags,newTag ,setNewTag}:DropDownTagsProps) {

    // let x: {tagName: string, tagPosition: number}[] = [{tagName: "prodcutivity",tagPosition:2},{tagName: "study",tagPosition:7}]
    let [filterTags, setFilterTags] = useState<{tagName:string, tagPosition: number}[] >([])
    function searchTag(){
        // console.log("seach tag call")
        if(tags){

            const searchingTags:{tagName:string, tagPosition: number}[]   = tags?.map((tag)=>{
                let pos = tag.search(newTag)
                if(pos>-1){
                    return {tagName: tag, tagPosition: pos}
                }
                return null
            })
            .filter((tag): tag is {tagName: string, tagPosition: number}=>tag!=null )
            .sort((a,b)=>{ return a!.tagPosition-b!.tagPosition})
            // console.log(searchingTags)
            // if(searchingTags)
                setFilterTags(searchingTags)
        }
        else return ;
    }

    useEffect(()=>{
        searchTag()
        // console.log(x)
        // console.log(newTag)
    },[newTag])

        return (
            <div className="flex flex-col shadow-md rounded-md absolute z-10 bg-white w-[calc(100%-8px)]">
                {
                   filterTags && filterTags.map((tag, key)=>(
                        <div 
                           key={key}
                           className="px-2 py-[2px] hover:bg-slate-100 cursor-pointer"
                           onClick={()=>{setNewTag(tag.tagName)}}>
                             <DisplayTag tag={tag} newTag={newTag} />
                        </div>)
                    ) 
                }
                
            </div>
        )
}

function DisplayTag({tag, newTag}: {tag: {tagName:string, tagPosition: number}, newTag: string}){
    const {tagName, tagPosition} = tag
    return (
        <span>{
            tagName.split("").map((char, i)=>{
                return(
                    i>=tagPosition && i<tagPosition+newTag.length ?
                    <span key={i} className="font-bold">{char}</span>
                    :
                    <span key={i} className="font-normal">{char}</span>
                )
            })}
        </span>
    )
}