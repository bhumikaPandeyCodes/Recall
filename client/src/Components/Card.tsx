import SocialsIcon from "@/icons/socialsIcon";
import VideoIcon from "@/icons/videoIcon";
import Tag from "@/ui/tag";

interface CardProps {
  type: "youtube" | "tweet" | "document" | "link",
  title: string,
  tags: string[],
  link: string
}

export default function Card({type, title, tags, link}:CardProps) {
  return (
    <div className="w-72  border-[1.2px] border-gray-500 transition-all duration-75 ease-in-out hover:border-[1.4px] bg-inherit rounded-md px-4 pt-2">
        <div className="flex items-center justify-center gap-4 ">
            {type=="youtube" && <VideoIcon />}
            {type=="tweet" && <SocialsIcon />}
            <span className="font-medium text-lg">{title}</span>
        </div>
        <div className="w-full  flex flex-col justify-between gap-4  ">
        <div className="w-fit">            
            {type=="youtube" && <iframe className="w-full mt-2 rounded-md" src={link.replace("watch?v=", "embed/")} title="YouTube video player"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
            { type =="tweet" && 
              <blockquote className="twitter-tweet ">           
                <a className="" href={link.replace("x.com","twitter.com")}></a>

            </blockquote> 
            }
          
        </div>
        <div>

            <div className="gap-2 flex flex-wrap ">
              {
                tags.map((tag, id)=>{
                  return(
                    <div key={id}>
                      <Tag tag={tag} />
                    </div>
                  )}
                )
              }
            </div>
            <div className="my-4 text-sm text-gray-400 ">
              Added on 10/01/2025
            </div>
        </div>

    </div>
    </div>
  )
}

