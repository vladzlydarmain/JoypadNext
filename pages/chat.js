import styles from "./chat.module.css";
import { socket } from "../socket";
import { useEffect, useState } from 'react';  
import Cookies from "js-cookie";  

export default function Chat() {

    const [message,setMessage] = useState()
    const [messages,setMessages] = useState([])
    const token = Cookies.get("token")
    const [info,setInfo] = useState()
    const [group,setGroup] = useState() 
    const [groups,setGroups] = useState()
    const [groupSettigsModal, setGroupSettigsModal] = useState(false)
    const [groupIdSettigs, setGroupIdSettigs] = useState()
    const [groupInfo,setGroupInfo] = useState()

    function updateMessages(groupId){
        fetch(`http://localhost:8000/messages/group/${groupId}`,{
            method:"GET",
            headers:{
                token:token
            }
        }).then((ressp)=>{
            return ressp.json()
        }).then(async(mesgs)=>{
            const msgs = []
            fetch(`http://localhost:8000/group/users/${groupId}`,{
                method:"GET"
            }).then((avas)=>{
                return avas.json()
            }).then(async(avatars)=>{
                for await(let i of mesgs.messages){
                    i["avatar"] = avatars.avatars[`${i.steamid}`]
                    msgs.push(i)
                }
                setMessages(msgs)
            })
        })
    }

    useEffect(()=>{
        if(!token){
            window.location.href = "http://localhost:8000/user/auth"
        } else {
            if(!info){
                fetch("http://localhost:8000/user/auth",{
                    method:"GET",
                    headers:{
                        token:token
                    }   
                }).then((response)=>{
                    return response.json()
                }).then((resp)=>{
                    setInfo(resp.info)
                }).then(()=>{
                    if(!groups){
                        fetch('http://localhost:8000/user/groups/',{
                            method:"GET",
                            headers:{
                                token:token
                            }
                        }).then((result)=>{
                            return result.json()
                        }).then((reslt)=>{
                            if(reslt.groups != null){
                                setGroups(reslt.groups)
                                setGroup(reslt.groups[0].id)
                                updateMessages(reslt.groups[0].id)
                            } 
                        })
                    }
                })
            }
        }
        if(group){
            console.log(group)
            socket.on(`message:${group}`,async(args)=>{
                const msgs = [...messages]
                if(!msgs.find(val=> val.id == args.id)){
                    msgs.push(args)
                    setMessages(msgs)
                }
            })
        }
    })

    function sendMessage(){
        if(`${Number(group)}`!="Nan"){
            if(message){
                if(message.target.value){
                    console.log(info.steamID)
                    socket.emit("send",{
                        message:message.target.value,
                        group:group,
                        token:token
                    }) 
                }
            }
        }
    }

    function openSettingsOfGroup(groupId){
        setGroupSettigsModal(true)
        setGroupIdSettigs(groupId)
        fetch("http://localhost:8000/")
    }

    function closeSettingsOfGroup(){
        setGroupSettigsModal(false)
        setGroupIdSettigs(undefined)
    }

    return (
        <div>
            {groups && 
                groups.map((grp,idx)=>{
                    return (
                        <button value={grp.id} onClick={(e)=>{setGroup(Number(e.target.value));updateMessages(Number(e.target.value))}} >{grp.name}</button>
                    )
                })
            }
            <input onChange={setMessage}/>
            <button onClick={sendMessage}>Send</button>
            {messages.length > 0 && 
                <div>
                    {messages.map((mess,idx)=>{
                        return (
                            <div key={idx}>
                                <img src={mess.avatar}/>
                                <p>{mess.name}</p>
                                <p>{mess.value}</p>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
        // <div>
        //     <header></header>
        //     <main>
        //         <div className={styles.mainBlock} >
        //             <div className={styles.smallBlock} >
        //                 <div className={styles.buttons} >
        //                     <div className={styles.code} ></div>
        //                     <div className={styles.creating} ></div>
        //                     <div className={styles.news} ></div>
        //                     <div className={styles.gaming} ></div>
        //                     <div className={styles.tournaments} ></div>
        //                 </div>
        //                 <div className={styles.settings} ></div>

        //             </div>
        //             <div className={styles.chat} ></div>
        //         </div>
        //     </main>
        // </div>
    )
}