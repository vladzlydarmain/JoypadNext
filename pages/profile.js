"use client"

import Cookies from "js-cookie";
import { useEffect, useState } from 'react';    
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import styles from "./profile.module.css";

export default function Home() {
    const router = useRouter();
    const token = Cookies.get("token")
    const [info,setInfo] = useState()
    const [userInfo,setUserInfo] = useState()
    const [code,setCode] = useState()
    const [description, setDescription] = useState()
    const [time,setTime] = useState()
    const [page,setPage] = useState("profile")
    const [groupRating,setGroupRating] = useState()

    function updateinfo(inffo){
        if(inffo){
            const steam32id = BigNumber(`${inffo.steamID}`).minus('76561197960265728').c[0]
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
                            const user = inffo
                            user["winrate"] = {"win": resp22['win'] + resp33['win'],"lose":resp22['lose'] + resp33['lose']}
                            user["rank"] = respp["rank_tier"]
                            setUserInfo(user)
                        } else {
                            const user = inffo
                            user["winrate"] = {"win": 0 ,"lose":0}
                            user["rank"] = null
                            console.log(user)
                            setUserInfo(user)
                        }
                    })
                })
            })
        }
    }

    function changeDescription(){
        fetch('http://localhost:8000/user/description',{
            method:"POST",
            headers:{
                token:token,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                description:description
            })
        }).then((resp)=>{
            return resp.json()
        }).then((data)=>{
            router.reload()
        })
    }

    function getCode(){
        if(!code){
            fetch('http://localhost:8000/user/auth/code',{
                method:"GET",
                headers:{
                    token:token
                }
            }).then((resp)=>{
                return resp.json()
            }).then((code)=>{
                let ttime = 60
                setTime(ttime)
                const interval = setInterval(()=>{
                    ttime -= 1
                    if(ttime > 0){
                        setTime(ttime)
                    }
                },1000)
                setTimeout(()=>{
                    setCode(undefined)
                    clearInterval(interval)
                    setTime(undefined)
                },60000)
                setCode(code.authCode)
            })
        }
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
                    if(resp.code != 200){
                        window.location.href = "http://localhost:8000/user/auth"
                    }
                    setInfo(resp.info)
                    updateinfo(resp.info)
                })
            }
        }

        if(page == "rating" && !groupRating){
            fetch("http://localhost:8000/group/rating",{
                method:"GET"
            }).then((response)=>{
                return response.json()
            }).then((data)=>{
                setGroupRating(data.groups)
            })
        }
    })


    return (
        <div className={styles.page}>
            <header>
                <div className={styles.headerLogo} onClick={()=>{window.location.href = "/"}}>
                  <img src={"http://localhost:8000/image/logo.png"} alt="Logo" width={47} height={47} />
                  <h3 className={styles.logo}>Joypad</h3>
                </div>
        
                <div className={styles.headerButtons}>
        
                  <button className={styles.transperentButton} onClick={()=>{window.location.href = "/profile/"}}>Home</button>
                  <button className={styles.transperentButton} onClick={()=>{window.location.href="/chat/"}}>Chat</button>
        
                </div>
            </header>
            <div className={styles.main1}>
                <div className={styles.sideBar}>
                    <button className={styles.buttonBack} onClick={()=>{window.location.href="/chat/"}}>
                        <img src="http://localhost:8000/image/strelka_left.png" alt="left" width={36} height={36} />
                        Back
                    </button>
                    <button className={page=="profile" ? styles.sideBarButtonsSelected:styles.sideBarButtons} onClick={()=>{setPage("profile")}}>
                        <img src={`http://localhost:8000/image/user${page == "profile" ? 1:2}.png`}/>
                        Profile
                    </button>
                    <button className={page=="rating" ? styles.sideBarButtonsSelected:styles.sideBarButtons} onClick={()=>{setPage("rating")}}>
                        <img src={`http://localhost:8000/image/ranking${page == "rating" ? 1:2}.png`}/>
                        Rating
                    </button>
                    <button className={styles.sideBarButtons} onClick={()=>{window.location.href = "/achievements/"}}>
                        <img src="http://localhost:8000/image/achievements.png"/>
                        Achievements
                    </button>
                </div>
                {page == "profile" && userInfo &&                
                    <div className={styles.profileRight}>
                        <div className={styles.profileHalf}>
                            <div className={styles.descriptionDiv}>
                                <div className={styles.descriptionRow}>
                                    <h4 style={{margin:0}}>DESCRIPTION</h4>
                                    <button className={styles.applyButton} onClick={()=>{changeDescription()}}>
                                        Apply
                                    </button>
                                </div>
                                <textarea className={styles.descriptionInput} onChange={(e)=>{setDescription(e.target.value)}}></textarea>
                            </div>
                            <div>
                                <div className={styles.securityDiv}>
                                    <h4>SECURITY</h4>
                                    {time && 
                                        <p>{time}</p>
                                    }
                                </div>
                                <button className={styles.securityButton} onClick={()=>{getCode();}}>{code || "verification code"}</button>
                            </div>
                        </div>
                        <div className={styles.profileHalf}>
                            <h4>About Me</h4>
                            <div className={styles.profile}>
                                <img src={userInfo.avatar} className={styles.avatarInfo}/>
                                <div className={styles.rankDiv}>
                                    <img src={`https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_${`${userInfo.rank}` == 'null' ? 0: `${userInfo.rank}`[0]}.png`}/>
                                    {info.rank != null && info.rank[1] != 0 &&
                                        <img src={`https://www.opendota.com/assets/images/dota2/rank_icons/rank_star_${userInfo.rank[1]}.png`}/>
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
                                    <h2 className={styles.statWinShare}>{Math.round(100/(userInfo.winrate.win+userInfo.winrate.lose == 0 ? 1:info.winrate.win+info.winrate.lose)*info.winrate.win)}%</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {page == "rating" && userInfo && 
                    <div className={styles.ratingPage}>
                        <h2>GROUPS</h2>
                        {groupRating && 
                            <div className={styles.ratingBox}>
                                {groupRating.map((group,idx)=>{
                                    return(
                                        <div className={styles.ratingGroup}>
                                            <div className={styles.groupInfo}>
                                                <h2>#{idx+1}</h2>
                                                <p>{group.name}</p>
                                            </div>
                                            <p>Загальна кількість очків: {group.points}</p>
                                        </div>
                                    )
                                })}      
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}