import validator  from "validator"
export function random(len:number){

    const options = "qwertyuiopasdfghjklzxcvbnm1234567890"
    const length = options.length
    let ans = ""
    for(let i=0;i<len;i++){
        ans = ans + options[Math.floor(Math.random()*length)] 
    }
    return ans
}

export function capitalName(name:string){
    const nameArr = name.split(" ",2)
    let firstName =""
    let lastName =""
    if(nameArr[0].length>2){
        nameArr[0]=nameArr[0].charAt(0).toUpperCase() + nameArr[0].slice(1,nameArr[0].length) 
        firstName = nameArr[0]
    }
    if(nameArr[1]){
        nameArr[1]=nameArr[1].charAt(0).toUpperCase() + nameArr[1].slice(1,nameArr[1].length)
        lastName =  " "+nameArr[1]
    }
    return (firstName+lastName)
}