import TweetIcon from "@/icons/tweetIcon";
import VideoIcon from "@/icons/videoIcon";
import Tag from "@/ui/tag";
import { TagsType } from "./MainPanel";
import LinkIcon from "@/icons/linkIcon";
import DeleteIcon from "@/icons/deleteIcon";

interface CardProps {
  id: string,
  type: string
  title: string,
  tags: TagsType[],
  link: string,
  createdAt : string,
  deleteContent?: (id: string)=>void,
  authorize: boolean,
}

export default function Card({id, type, title, tags, link, createdAt,authorize ,deleteContent}:CardProps) {

  function dateConvert(date: string){
    let d = new Date(date)
    return d.toLocaleDateString()
  }  

  return (
    <div id={id} className="w-72  border-[1.2px] border-gray-500 transition-all duration-75 ease-in-out hover:border-[1.4px] bg-inherit rounded-md px-4 pt-2">
        <div className="flex items-center justify-between gap-4 ">
            {type=="Youtube" && <VideoIcon />}
            {type=="Tweet" && <TweetIcon />}
            {type=="Link" && <LinkIcon />}
            <span className="font-medium text-lg text-wrap text-center">{title}</span>
            {
            authorize && deleteContent?   
              <div onClick={()=>deleteContent(id)}>
              <DeleteIcon />
            </div>: null
            }
        </div>
        <div className="w-full  flex flex-col justify-between gap-4 object-fill ">
        <div className="w-fit h-80">            
            {type=="Youtube" && <iframe className="w-full mt-2 rounded-md" src={link.replace("watch?v=", "embed/")} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
            
            { type =="Tweet" && 
            <div className="h-80  overflow-auto">
              <blockquote className="twitter-tweet " >           
                <a className="" href={link.replace("x.com","twitter.com")}></a>

            </blockquote> 
              </div>
            }

            {
              type=="Link" &&
              <span className="w-full mt-2 text-wrap flex flex-wrap break-all">
                <a className="text-gray-700 underline text-center text-wrap break-all" href={link} target="_blank" rel="noopener">{link}</a>
              </span>
            }
          
        </div>
        <div>

            <div className="gap-2 flex flex-wrap ">
              {
                tags.map((tag, id)=>{
                  return(
                    <div key={tag._id}>
                      <Tag id={id} tag={tag.name} />
                    </div>
                  )}
                )
              }
            </div>
            <div className="my-4 text-sm text-gray-400 ">
              Added on {dateConvert(createdAt)}
            </div>
        </div>

    </div>
    </div>
  )
}

