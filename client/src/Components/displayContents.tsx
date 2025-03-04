import Card from "./Card"
import { ContentsType } from "./MainPanel";

interface displayContentProps{
    contents: ContentsType[] | null;
    message:string
    deleteContent?: (id:string)=>void,
    authorize: boolean
}


export default function DisplayContent({contents, message, deleteContent, authorize}: displayContentProps){

    return(
        <div className="flex gap-4 flex-wrap sm:justify-normal justify-center">
              {(contents?.length)? contents.map((content)=>{ 
            return (<Card authorize={authorize} id={content._id} key={content._id} type={content.type} title={content.title} tags={content.tags} link={content.link} deleteContent={deleteContent} createdAt={content.createdAt}/>)
            }) :<p className="text-gray-500 w-full text-lg text-center ">{message}</p>}
        </div> 
    )
}