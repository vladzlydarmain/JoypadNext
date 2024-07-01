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
    const [groupRank, setGroupRank] = useState()
    const [groupInfo, setGroupInfo] = useState()
    const [groupMembers,setGroupMembers] = useState()
    const [groups, setGroups] = useState()
    const [modal, setModal] = useState(false)
    const [submodal, setSubModal] = useState(false)
    const [createModal, setCreateModal] = useState(false)
    const [code,setCode] = useState()
    const [error,setError] = useState()
    const [userInfo,setUserInfo] = useState()
    const [mute,setMute] = useState()
    const [name,setName] = useState()
    const [category,setCategory] = useState()
    const [description,setDescription] = useState()
    const [categories,setCategories] = useState()

    function updateMessages(groupId){
        if(groupId && groupId != group){
            fetch(`https://joypadapi.onrender.com/messages/group/${groupId}`, {
                method: "GET",
                headers: {
                    token: token
                }
            }).then((ressp) => {
                return ressp.json()
            }).then(async (mesgs) => {
                const msgs = []
                fetch(`https://joypadapi.onrender.com/group/users/avatar/${groupId}`, {
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
            window.location.href = "https://joypadapi.onrender.com/user/auth"
        } else {
            if (!info) {
                fetch("https://joypadapi.onrender.com/user/auth", {
                    method: "GET",
                    headers: {
                        token: token
                    }
                }).then((response) => {
                    return response.json()
                }).then((resp) => {
                    if(resp.code != 200){
                        window.location.href = "https://joypadapi.onrender.com/user/auth"
                    } else {
                        setInfo(resp.info)
                    }
                }).then(() => {
                    if (!groups) {
                        fetch('https://joypadapi.onrender.com/user/groups/', {
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
                }).then(()=>{
                    if(!categories){
                        fetch('https://joypadapi.onrender.com/group/category/all',{
                            method:"GET"
                        }).then((catResp)=>{
                            return catResp.json()
                        }).then((cat)=>{
                            setCategories(cat.message)
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
            socket.on(`mute:${group}:${info.steamID}`,async (args)=>{
                if(mute != args){
                    setMute(args)                    
                }
            })
        }
    })

    function sendMessage() {
        if (`${Number(group)}` != "Nan") {
            if (message.split(/,| |\n/).filter((mess) => mess != '').length > 0) {
                if(message.length <= 3000){
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
    }

    function joinGroup(){
        if(code){
            fetch(`https://joypadapi.onrender.com/group/user/?code=${code}`,{
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

    function deleteMessage(id){
        socket.emit("delete",{
            token:token,
            id:Number(id),
            groupId:group
        })
    }

    async function openSettingsOfGroup(info) {
        setModal(true)
        setGroupInfo(info)
        fetch(`https://joypadapi.onrender.com/group/users/${info.id}`,{
            method:"GET",
        }).then((usersResp)=>{
            return usersResp.json()
        }).then(async (users)=>{
            fetch('https://joypadapi.onrender.com/group/rating/',{
                method:"GET",
            }).then((rankigRes)=>{
                return rankigRes.json()
            }).then((ranking)=>{
                setGroupMembers(users.users)
                setGroupRank(ranking.groups.findIndex((elem)=>elem.id == info.id)+1)
            })
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

    function createGroup(){
        fetch('https://joypadapi.onrender.com/group/',{
            method:"POST",
            headers:{
                token:token,
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                name:name,
                description:description,
                category:category
            })
        }).then((resp)=>{
            return resp.json()
        }).then((respp)=>{
            if(respp.code!=201){
                setError(respp.error)
                console.log(respp.error)
            } else {
                Router.reload()
            }
        })
    }

    function mutte(id){
        socket.emit("mute",{
            token:token,
            group:groupInfo.id,
            target:id
        })
    }

    function leave(groupid){
        fetch(`https://joypadapi.onrender.com/group/user/${groupid}`,{
            method:"DELETE",
            headers:{
                token:token
            }
        }).then(()=>{
            Router.reload()
        })
    }

    return (
        <div className={styles.page}>
            <header>
                <div className={styles.headerLogo} onClick={()=>{window.location.href="/"}}>
                    <Image loader={() => `https://joypadapi.onrender.com/image/logo.png`} src={"https://joypadapi.onrender.com/image/logo.png"} alt="Logo" width={47} height={47} />
                    <h3 className={styles.logo}>Joypad</h3>
                </div>
                <div className={styles.headerButtons}>
                    <button className={styles.transperentButton} onClick={()=>{window.location.href="/"}}>Home</button>
                    <button className={styles.transperentButton}>Chat</button>
                </div>
            </header>
            <main className={styles.main1}>
                <div className={styles.sideBar}>
                    <div className={styles.sideBarAll}>
                        <div className={styles.enterCodeButton}>
                            <input className={styles.enterCodeInput} placeholder="Enter code" onChange={(e)=>{setCode(e.target.value)}}/>
                            <button className={styles.imageEnter} onClick={joinGroup}>
                                <Image loader={() => `https://joypadapi.onrender.com/image/Vector.png`} src={"https://joypadapi.onrender.com/image/Vector.png"} alt="Logo" width={22} height={22} />
                            </button>
                        </div>
                        <button className={styles.createGroupButton} onClick={()=>{setCreateModal(true)}}>
                            Create group
                        </button>
                        
                        <div className={styles.menuSelector}>
                            {groups && 
                                groups.map((grp,idx)=>{
                                    return (
                                        <button key={idx} className={Number(grp.id) == Number(group) ? styles.sideBarButtonsSelected:styles.sideBarButtons } value={grp.id} onClick={(e)=>{if(e.target.value && Number(e.target.value)!= group){setGroup(Number(e.target.value));updateMessages(Number(e.target.value))}}} >
                                            <div className={styles.nameButton}>{grp.name}</div>
                                            <button className={styles.dotsButton} onClick={()=>{openSettingsOfGroup(groups[idx])}}>
                                                <Image loader={() => `https://joypadapi.onrender.com/image/dots1.png`} src={"https://joypadapi.onrender.com/image/dots1.png"} width={36} height={36} />
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
                            <img src={"https://joypadapi.onrender.com/image/settings1.png"} style={{cursor:"pointer"}} width={36} height={36} onClick={()=>{window.location.href="/profile/"}}/>
                        </div>
                    </div>
                </div>

                <div className={styles.messages}>
                    {messages.length > 0 && 
                    <div id="ll" className={styles.messageArea} onLoad={()=>{const obj = document.querySelector("#ll");obj.scrollTo(0,obj.scrollHeight)}}>
                        {messages.map((mess,idx)=>{
                            let prevDate
                            if(messages[idx-1]){
                                prevDate = messages[idx-1].createdAt.split('T')[0].split(":")
                            }
                            const avatarExist = !messages[idx-1] || messages[idx-1].steamid != messages[idx].steamid 
                            const timeSrc = mess.createdAt.split('T')[1].split(":")
                            const time = timeSrc[0]+":"+timeSrc[1]
                            const dateSrc = mess.createdAt.split('T')[0]
                                
                            return (
                                <div className={styles.oneDayMassage} key={idx}>
                                    {(!prevDate  || prevDate!= dateSrc) && 
                                        <div className={styles.dateDiv}>
                                            <hr className={styles.messageTimeLine}/>
                                            <h6 className={styles.messageDate}>{dateSrc}</h6>
                                            <hr className={styles.messageTimeLine}/>
                                        </div>
                                    }
                                    <div className={styles.message} key={idx}>
        

                                        {avatarExist &&
                                            <img className={styles.avatar} src={mess.avatar}/>
                                        } 
                                        {!avatarExist &&   
                                            <div className={styles.messageTimeDel}>
                                                {mess.steamid == info.steamID && 
                                                    <img className={styles.delImg} src='https://joypadapi.onrender.com/image/delete.png' onClick={()=>{deleteMessage(mess.id)}}/>
                                                }
                                                <p className={styles.messageTimeInvis}>{time}</p>
                                            </div>
                                        } 

                                        <div className={styles.messageBlock}>
                                            {(!messages[idx-1] || messages[idx-1].steamid != messages[idx].steamid )&&
                                                <div className={styles.messageInfo}>
                                                    <h3 className={styles.messageName}>{mess.name}</h3>
                                                    <h6 className={styles.messageTime}>{time}</h6>
                                                    {mess.steamid == info.steamID && 
                                                        <img className={styles.delImg} src='https://joypadapi.onrender.com/image/delete.png' onClick={()=>{deleteMessage(mess.id)}}/>
                                                    }
                                                </div> 
                                            }

                                            {mess.value.split("\n").map((ms,idx)=>{
                                                return (  
                                                    <p key={idx} className={styles.messageText}>{ms}</p>
                                                )
                                            })}

                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    }
                    <div className={styles.enterMessage}>
                        <textarea className={styles.sendInput} onChange={(e)=>{setMessage(e.target.value)}} value={message} minLength={1} maxLength={3000}></textarea>
                        {!(mute) &&
                            <button className={styles.sendButton} onClick={sendMessage}>
                                <Image loader={() => `https://joypadapi.onrender.com/image/send1.png`} src={"https://joypadapi.onrender.com/image/send1.png"} width={25} height={25} />
                            </button>
                        }
                    </div>
                </div>
            </main>
            {modal && 
                <div className={styles.modalWrapper} onClick={(e)=>{setModal(false);setError(undefined);e.stopPropagation();setGroupMembers(undefined)}}>
                    {error || 
                        <div className={styles.modalBox} onClick={(e)=>{e.stopPropagation()}}>
                            <h2>Members</h2>
                            {groupInfo && <p>Join code: <strong>{groupInfo.code}</strong></p>}
                            <div className={styles.membersList}>
                                {groupMembers && groupMembers.map((member,idx)=>{
                                    return(
                                        <button className={styles.memberButton} key={idx} onClick={()=>{openUserInfo(member)}}>
                                            <img className={styles.avatar} src={member.avatar}/>
                                            <h3>{member.name}</h3>
                                            <div className={styles.fill}></div>
                                            {groupInfo.admin_id == info.steamID && 
                                                <button className={styles.muteButton} onClick={(e)=>{e.stopPropagation();mutte(member.steamID);const img = document.querySelector(`#mute${idx}`);if(img.src == "https://joypadapi.onrender.com/image/mute.png"){img.src = "https://joypadapi.onrender.com/image/sound.png"}else{img.src = "https://joypadapi.onrender.com/image/mute.png"}}}>
                                                    <img id={`mute${idx}`} className={styles.muteImg} src={`https://joypadapi.onrender.com/image/${member.mute ? "mute":"sound"}.png`} />
                                                </button>
                                            }
                                        </button>
                                    )
                                })}
                            </div>
                            {groupInfo && 
                                <button className={styles.achievementsButton} onClick={()=>{window.location.href = `/achievements/${groupInfo.id}`}}>
                                    <img src="https://joypadapi.onrender.com/image/ranking2.png"/>
                                    Achievements
                                </button>
                            }
                            <div className={styles.info}>
                                <img src="https://joypadapi.onrender.com/image/ranking2.png"/>
                                <div>
                                    <p>Current place in ranking: #{groupRank}</p>
                                    <p>Total points: {groupInfo.points}</p>
                                </div>
                            </div>
                            <button className={styles.leaveButton} onClick={()=>{leave(groupInfo.id)}}>Leave</button>
                        </div>
                    }
                </div>
            }
            {submodal &&
                <div className={styles.modalWrapper} onClick={(e)=>{e.stopPropagation();setSubModal(false);setUserInfo(undefined);}}>
                    {userInfo && 
                        <div className={styles.modalInfoBox} onClick={(e)=>{e.stopPropagation()}}>
                            <div className={styles.profile}>
                                <img src={userInfo.avatar} className={styles.avatarInfo}/>
                                <div className={styles.rankDiv}>
                                    <img src={`https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_${`${userInfo.rank}` == 'null' ? 0: `${userInfo.rank}`[0]}.png`}/>
                                    {userInfo.rank != null && userInfo.rank[1] != 0 &&
                                        <img src={`https://www.opendota.com/assets/images/dota2/rank_icons/rank_star_${`${userInfo.rank}`[1]}.png`}/>
                                    }
                                </div>
                            </div>
                            <p className={styles.name} >{userInfo.name}</p>
                            <h3 className={styles.description}>{userInfo.description || ""}</h3>
                            <div className={styles.userStats}>
                                <div className={styles.statInfo}>
                                    <p className={styles.stat}>victory</p>
                                    <h3 className={styles.statWin}>{userInfo.winrate.win}</h3>
                                </div>
                                <div className={styles.statInfo}>
                                    <p className={styles.stat}>defeats</p>
                                    <h3 className={styles.statLose}>{userInfo.winrate.lose}</h3>
                                </div>
                                <div className={styles.statInfo}>
                                    <p className={styles.stat}>win share</p>
                                    <h2 className={styles.statWinShare}>{Math.round(100/(userInfo.winrate.win+userInfo.winrate.lose == 0 ? 1:userInfo.winrate.win+userInfo.winrate.lose)*userInfo.winrate.win)}%</h2>
                                </div>
                            </div>
                            <button className={styles.buttonOk} onClick={(e)=>{setSubModal(false); setUserInfo(undefined); e.stopPropagation()}}>
                                Ok
                            </button>
                        </div>
                    }
                </div> 
            }
            {createModal &&
                <div className={styles.modalWrapper} onClick={(e)=>{e.stopPropagation();setCreateModal(false)}}>
                    <div className={styles.modalBoxGroup} onClick={(e)=>{e.stopPropagation()}}>
                        <input className={styles.nameInput} onChange={(e)=>{console.log(e.target.value);setName(e.target.value)}} placeholder={"Group name"}/>
                        {categories && 
                            <select className={styles.selectCategory} onChange={(e)=>{setCategory(e.target.value)}}>
                                {categories.map((categ,idx)=>{
                                    return (
                                        <option value={categ.id} key={idx}>{categ.name}</option>
                                    )
                                })}
                            </select>
                        }
                        <textarea className={styles.descriptionInput} onChange={(e)=>{setDescription(e.target.value)}} placeholder="..."></textarea>
                        <button className={styles.createButton} onClick={()=>{createGroup()}}>
                            Create Group
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}