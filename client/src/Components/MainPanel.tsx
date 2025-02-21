import AddIcon from "@/icons/addIcon"
import Button from "@/ui/Button"
import ShareIcon from "@/icons/shareIcon"
import Card from "./Card"
import { SetStateAction, useState } from "react"
import ContentModal from "./contentModal"
import ShareModal from "./shareModal"

interface mainPanelProps{
  addContent: boolean,
  setAddContent: React.Dispatch<SetStateAction<boolean>>
  share: boolean,
  setShare: React.Dispatch<SetStateAction<boolean>>
}

const MainPanel = ({addContent, setAddContent, share, setShare}: mainPanelProps) => {


  function handleAddContent(){
    setAddContent(true)
    setShare(false)
  }

  function handleShareContent(){
    setShare(true)
    setAddContent(false)
  }
  



  return (
    <div className="h-full w-[calc(100vw-18rem)] p-3 relative ">
     { addContent && <div className="absolute left-[300px] top-[100px] bg-white justify-center items-center rounded-md">
                    <ContentModal setAddContent={setAddContent} />
                </div>}
      {share && <div className="absolute left-[300px] top-[100px]">
          <ShareModal setShare={setShare}/>
        </div>}

        <div>
        <div className="flex justify-between">
            <span className="font-semibold text-xl">Hello Sarah!</span>
            <div className="flex gap-2">
                <Button onClick={handleAddContent} type="primary" text="Add content" startIcon={<AddIcon/>} />
                <Button onClick={handleShareContent} type="primary" text="Share" startIcon={<ShareIcon/>} />
            </div>
        </div>

        <div className="flex gap-4 mt-20">
            <Card type="tweet" title="Interview tips" tags={["interview", "job"]} link="https://x.com/itrytoohard/status/1892099556113829903" />
            <Card type="youtube" title="Web development" tags={["productivity", "selfcare"]} link="https://www.youtube.com/watch?v=nlx8ug7o5gI" />
            <Card type="youtube" title="Web development" tags={["productivity", "selfcare"]} link="https://www.youtube.com/watch?v=cydFlJQNAjY" />
        </div>
       </div>
    </div>
  )
}

export default MainPanel
