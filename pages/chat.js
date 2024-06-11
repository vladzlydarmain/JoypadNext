import styles from "./chat.module.css";
import { socket } from "../socket";
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import Image from "next/image";
import Router from "next/router";
import BigNumber from "bignumber.js";

export default function Chat() {
    const [message, setMessage] = useState()
    const [messages, setMessages] = useState([])
    const token = Cookies.get("token")
    const [info, setInfo] = useState()
    const [group, setGroup] = useState()
    const [groupInfo, setGroupInfo] = useState()
    const [groupMembers,setGroupMembers] = useState()
    const [groups, setGroups] = useState()
    const [modal, setModal] = useState(false)
    const [submodal, setSubModal] = useState(false)
    const [code,setCode] = useState()
    const [error,setError] = useState()
    const [userInfo,setUserInfo] = useState()

    function updateMessages(groupId) {
        if(groupId && groupId != group){
            fetch(`http://localhost:8000/messages/group/${groupId}`, {
                method: "GET",
                headers: {
                    token: token
                }
            }).then((ressp) => {
                return ressp.json()
            }).then(async (mesgs) => {
                const msgs = []
                fetch(`http://localhost:8000/group/users/avatar/${groupId}`, {
                    method: "GET"
                }).then((avas) => {
                    return avas.json()
                }).then(async (avatars) => {
                    for await (let i of mesgs.messages) {
                        i["avatar"] = avatars.avatars[`${i.steamid}`]
                        msgs.push(i)
                    }
                    setMessages(msgs)
                })
            })
        }
    }

    useEffect(() => {
        if (!token) {
            window.location.href = "http://localhost:8000/user/auth"
        } else {
            if (!info) {
                fetch("http://localhost:8000/user/auth", {
                    method: "GET",
                    headers: {
                        token: token
                    }
                }).then((response) => {
                    return response.json()
                }).then((resp) => {
                    if(resp.code != 200){
                        window.location.href = "http://localhost:8000/user/auth"
                    } else {
                        setInfo(resp.info)
                    }
                }).then(() => {
                    if (!groups) {
                        fetch('http://localhost:8000/user/groups/', {
                            method: "GET",
                            headers: {
                                token: token
                            } 
                        }).then((result) => {
                            return result.json()
                        }).then((reslt) => {
                            if (reslt.groups != null) {
                                setGroups(reslt.groups)
                                setGroup(reslt.groups[0].id)
                                updateMessages(reslt.groups[0].id)
                            }
                        })
                    }
                })
            }
        }
        if (group) {            
            socket.on(`message:${group}`, async (args) => {
                const msgs = [...messages]
                if (!msgs.find(val => val.id == args.id)) {
                    msgs.push(args)
                    setMessages(msgs)
                }
            })
            socket.on(`deleteMessage:${group}`, async (args) => {
                const msgs = [...messages]
                msgs.splice(msgs.findIndex((elem)=>Number(elem.id)==Number(args.id)),1)
                setMessages(msgs)
            })
        }
    })

    function sendMessage() {
        if (`${Number(group)}` != "Nan") {
            if (message) {
                if(message.length > 0){
                    setMessage("")
                    socket.emit("send", {
                        message: message,
                        group: group,
                        token: token
                    })
                }
            }
        }
    }

    function joinGroup(){
        if(code){
            fetch(`http://localhost:8000/group/user/?code=${code}`,{
                method:"POST",
                headers:{
                    token:token
                }
            }).then((response)=>{
                return response.json()
            }).then((resp)=>{
                if(resp.code != 200){
                    setModal(true)
                    setError(resp.error)
                } else {
                    Router.reload()
                }
            })
        }
    }

    function deleteMessage(e){
        socket.emit("delete",{
            token:token,
            id:Number(e.target.value),
            groupId:group
        })
    }

    async function openSettingsOfGroup(info) {
        setModal(true)
        setGroupInfo(info)
        await fetch(`http://localhost:8000/group/users/${info.id}`,{
            method:"GET",
        }).then((usersResp)=>{
            return usersResp.json()
        }).then(async (users)=>{
            await setGroupMembers(users.users)
        })
    }

    function openUserInfo(user){
        setSubModal(true)
        const steam32id = BigNumber(`${user.steamID}`).minus('76561197960265728').c[0]
        fetch(`https://api.opendota.com/api/players/${steam32id}`,{
            method:"GET"
        }).then((resp)=>{
            return resp.json()
        }).then((respp)=>{
            fetch(`https://api.opendota.com/api/players/${steam32id}/wl/?significant=0&game_mode=23`,{
                method:"GET"
            }).then((resp2)=>{
                return resp2.json()
            }).then((resp22)=>{
                fetch(`https://api.opendota.com/api/players/${steam32id}/wl/`,{
                    method:"GET"
                }).then((resp3)=>{
                    return resp3.json()
                }).then((resp33)=>{
                    if(!respp["error"]){
                        user["winrate"] = {"win": resp22['win'] + resp33['win'],"lose":resp22['lose'] + resp33['lose']}
                        user["rank"] = respp["rank_tier"]
                        setUserInfo(user)
                    } else {
                        user["winrate"] = {"win": 0 ,"lose":0}
                        user["rank"] = null
                        setUserInfo(user)
                    }
                })
            })
        })
    }

    function closeUserInfo(){
        setSubModal(false)
    }

    function closeSettingsOfGroup() {
        setModal(false)
    }

    function closeErrorModal(){
        setModal(false)
        setError(undefined)
    }

    return (
        <div className={styles.page}>
            <header>
                <div className={styles.headerLogo}>
                    <Image loader={() => `http://localhost:8000/image/logo.png`} src={"http://localhost:8000/image/logo.png"} alt="Logo" width={47} height={47} />
                    <span className={styles.logo}>Joypad</span>
                </div>
                <div className={styles.headerButtons}>
                    <button className={styles.transperentButton}>Home</button>
                    <button className={styles.transperentButton}>Chat</button>
                </div>
            </header>
            <main className={styles.main1}>
                <div className={styles.sideBar}>
                    <div className={styles.sideBarAll}>
                        <div className={styles.enterCodeButton}>
                            <input className={styles.enterCodeInput} placeholder="Enter code" onChange={(e)=>{setCode(e.target.value)}}/>
                            <button className={styles.imageEnter} onClick={joinGroup}>
                                <Image loader={() => `http://localhost:8000/image/Vector.png`} src={"http://localhost:8000/image/Vector.png"} alt="Logo" width={22} height={22} />
                            </button>
                        </div>
                        <button className={styles.createGroupButton}>
                            Create group
                        </button>
                        
                        <div className={styles.menuSelector}>
                            {groups && 
                                groups.map((grp,idx)=>{
                                    return (
                                        <button key={idx} className={Number(grp.id) == Number(group) ? styles.sideBarButtonsSelected:styles.sideBarButtons } value={grp.id} onClick={(e)=>{if(e.target.value && Number(e.target.value)!= group){setGroup(Number(e.target.value));updateMessages(Number(e.target.value))}}} >
                                            <div className={styles.nameButton}>{grp.name}</div>
                                            <button className={styles.dotsButton} onClick={()=>{openSettingsOfGroup(groups[idx])}}>
                                                <Image loader={() => `http://localhost:8000/image/dots1.png`} src={"http://localhost:8000/image/dots1.png"} width={36} height={36} />
                                            </button>
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.footerButtons}>
                            {info && 
                                <strong>{info.name.toUpperCase()}</strong>
                            }
                            <Image loader={() => `http://localhost:8000/image/settings1.png`} src={"http://localhost:8000/image/settings1.png"} width={36} height={36} />
                        </div>
                    </div>
                </div>
                <div className={styles.messages}>
                    {messages.length > 0 && 
                    <div id="ll" className={styles.messageArea} onLoad={()=>{const obj = document.querySelector("#ll");obj.scrollTo(0,obj.scrollHeight)}}>
                        {messages.map((mess,idx)=>{
                            return (
                                <div className={mess.steamid == info.steamID ? styles.yourMessage:styles.receiverMessage} key={idx}>
                                    <div className={mess.steamid == info.steamID ? styles.messageSender:styles.messageReceiver}>
                                        <img className={styles.avatar} src={mess.avatar}/>
                                        <div className={mess.steamid == info.steamID ? styles.messageSenderInfo:styles.messageResiverInfo}>
                                            <h3 className={styles.messageName}>{mess.name}</h3>
                                            <h6 className={styles.messageTime}>{mess.createdAt}</h6>
                                        </div>
                                        {mess.steamid == info.steamID &&
                                                <button className={styles.deleteButton} value={mess.id} onClick={deleteMessage}>
                                                    delete message
                                                </button>
                                            }
                                    </div>
                                    {/* <h1 className={styles.LOOOOOOOOOOOOOOH}>LOOOOOOOOOOOOOOH</h1> */}


                                    {mess.value.split("\n").map((ms,idx)=>{
                                        return (
                                            <p key={idx} className={mess.steamid == info.steamID ? styles.senderText:styles.receiverText}>{ms}</p>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                    }
                    <div className={styles.enterMessage}>
                        <textarea className={styles.sendInput} onChange={(e)=>{setMessage(e.target.value)}} value={message}></textarea>
                        <button className={styles.sendButton} onClick={sendMessage}>
                            <Image loader={() => `http://localhost:8000/image/send1.png`} src={"http://localhost:8000/image/send1.png"} width={39} height={39} />
                        </button>
                    </div>
                </div>
            </main>
            {modal && 
                <div className={styles.modalWrapper} onClick={(e)=>{setModal(false);setError(undefined);e.stopPropagation()}}>
                    {error || 
                        <div className={styles.modalBox} onClick={(e)=>{e.stopPropagation()}}>
                            <h2>Members</h2>
                            {groupInfo && <p>Join code:{groupInfo.code}</p>}
                            <div>
                                {groupMembers && groupMembers.map((member,idx)=>{
                                    return(
                                        <button onClick={()=>{openUserInfo(member)}}>
                                            <img className={styles.avatar} src={member.avatar}/>
                                            <h3>{member.name}</h3>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    }
                </div>
            }
            {submodal &&
                <div className={styles.modalWrapper} onClick={(e)=>{e.stopPropagation();setSubModal(false)}}>
                    {userInfo && 
                        <div onClick={(e)=>{e.stopPropagation()}}>
                            <div>
                                <div>
                                    <img src={userInfo.avatar}/>
                                    <h3>{userInfo.name}</h3>
                                </div>
                                <img src={`https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_${`${userInfo.rank}` == 'null' ? 0: `${userInfo.rank}`[0]}.png`}/>
                                {userInfo.rank != null && userInfo.rank[1] != 0 &&
                                    <img src={`https://www.opendota.com/assets/images/dota2/rank_icons/rank_star_${userInfo.rank[1]}.png`}/>
                                }
                            </div>
                            <h3>{userInfo.description || ""}</h3>
                            <div>
                                <div>
                                    <p>victory</p>
                                    <h3>{userInfo.winrate.win}</h3>
                                </div>
                                <div>
                                    <p>defeats</p>
                                    <h3>{userInfo.winrate.lose}</h3>
                                </div>
                                <div>
                                    <p>win share</p>
                                    <h2>{100/(userInfo.winrate.win+userInfo.winrate.lose == 0 ? 1:userInfo.winrate.win+userInfo.winrate.lose)*userInfo.winrate.win}%</h2>
                                </div>
                            </div>
                        </div>
                    }
                    <button onClick={(e)=>{closeUserInfo(); setUserInfo(undefined); e.stopPropagation()}}>
                        Ok
                    </button>
                </div>
            }
        </div>
    )
}