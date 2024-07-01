import Image from "next/image";
import styles2 from "./achievements.module.css";
import styles from "../app/page.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Achievements() {
  const [data, setData] = useState()
  const [stats, setStats] = useState()
  const [filter, setFilter] = useState([])

  const token = Cookies.get("token")

  useEffect(() => {
    console.log("FETCH -1")
    if (!token || token == null || token == "undefined") {
      window.location.href = "https://joypadapi.onrender.com/user/auth"
    }
    console.log("FETCH 0")
    if (!data) {
      fetch(`https://joypadapi.onrender.com/achievements/user/`, {
        method: "GET",
        headers: {
          token: token
        }
      }).then((response) => {
        console.log("FETCH 2")
        return response.json()
      }).then((resp) => {
        setData(resp.achievement)
      })
    if(!stats){
      fetch("https://joypadapi.onrender.com/user/stats", {
        method: "GET",
        headers: {
          token: token
        }
      }).then((respons) => {
        return respons.json()
      }).then((rep) => {
        setStats(rep.message)
      })
    }
    }
  })

  function fetchUserAchievements(){
    fetch("https://joypadapi.onrender.com/user/achievements/", {
      method: "GET",
      headers: {
          token: token
        }
    }).then((respn) => {
      return respn.json()
    }).then((rsp) => {
      setFilter(rsp.message)
    })
  }

  function handleCheckboxChange(category){
    if (filter.includes(category)){
      setFilter(filter.filter((c) => c !== category))
    } else {
      setFilter([...filter, category])
    }
  }


  // console.log("FETCHED ACHIEVEMENTS")
  return (
    <div className={styles2.page}>
      <header>
        <div className={styles.headerLogo} onClick={()=>{window.location.href = "/"}}>
          <img src={"https://joypadapi.onrender.com/image/logo.png"} alt="Logo" width={47} height={47} />
          <h3 className={styles.logo}>Joypad</h3>
        </div>
        <div className={styles.headerButtons}>

          <button className={styles.transperentButton} onClick={()=>{window.location.href = "/profile/"}}>Home</button>
          <button className={styles.transperentButton} onClick={()=>{window.location.href = "/chat/"}}>Chat</button>

        </div>
      </header>
      <main className={styles2.mainBody}>
        {data &&
          <div className={styles2.content}>
            {data.filter((res) => ( filter.length === 0 || 
              filter.includes(res.category)
            )).map((res, idx) => {
              console.log("THIS IS RES", res)
              return (
                <div className={styles2.achievement} key={idx}>
                  <h3 className={styles2.achievementName}> {res.name} </h3>
                  <div>
                    <Image loader={() => `https://joypadapi.onrender.com/image/message_icon_achievements.png`} src={"https://joypadapi.onrender.com/image/message_icon_achievements.png"} width={111} height={111} />
                  </div>
                  {stats &&
                    <div>
                      <progress className={Number(res.category == 1 ? stats.sentMessages : stats.deletedMessages) >= res.value ? styles2.progress1 : styles2.progress2} max={res.value} value={res.category == 1 ? stats.sentMessages : stats.deletedMessages}></progress>
                      <h4 className={styles2.progressValue}>{res.category == 1 ? stats.sentMessages : stats.deletedMessages}/{res.value} </h4>
                    </div>
                  }
                </div>
              )
            })}
          </div>
        }
        <div className="div_filter">
          <div className={styles2.filter}>
            <h3 className="text-white">Filter</h3>
            <div className="form-check">
              <input onClick={() => handleCheckboxChange(1)} className="form-check-input" type="checkbox" id="flexCheckDefault" />
              <label className="form-check-label text-white" htmlFor="flexCheckDefault">
                Send
              </label>
            </div>
            <div className="form-check">
              <input onClick={() => handleCheckboxChange(2)} className="form-check-input" type="checkbox" id="flexCheckDefault" />
              <label className="form-check-label text-white" htmlFor="flexCheckDefault">
                Delete
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
