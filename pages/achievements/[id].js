import Image from "next/image";
// import 'bootstrap/dist/css/bootstrap.css';
// import styles3 from '../app/globals./css'
import styles2 from "../achievements.module.css";
import styles from "@/app/page.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Achievements() {
  const [data, setData] = useState()
  const [stats, setStats] = useState()
  const token = Cookies.get("token")

  const router = useRouter()

  const id = router.query.id 


  useEffect(() => {
    console.log("FETCH -1")
    if (!token || token == null || token == "undefined") {
      window.location.href = "http://localhost:8000/user/auth"
    }
    console.log("FETCH 0")
    if (id || id != undefined) {
      if (!data) {
        console.log("THIS IS ID", id)
        console.log("FETCH 1")
        fetch(`http://localhost:8000/achievements/group/all`, {
          method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {
          console.log("FETCH 2")
          return response.json()
        }).then((resp) => {
          console.log("FETCH 3")
          console.log(resp)
          setData(resp.message)
          console.log("THIS IS DATA", data)
        })
        console.log('THIS IS FETCH DATA')
        if (!stats){
          fetch(`http://localhost:8000/group/stats/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          }).then((respons) => {
            console.log("FETCH 2")
            return respons.json()
          }).then((rep) => {
            console.log("FETCH 3")
            console.log(rep)
            setStats(rep.message)
            console.log("THIS IS STATS", stats)
          })
        }
        
      }
 
      }
    })

  console.log("THIS IS DATA", data)

  // console.log("DATA", data)

  // console.log("DATA", data.length)

  // function fetchAchievements(){  
  //       fetch("http://localhost:8000/achievements/user", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     }).then((response) => {
  //       return response.json()
  //     }).then((resp) => {
  //       data.push(resp)
  //       console.log("THIS IS DATA", resp)
  //     })
  // }


  // console.log("FETCHED ACHIEVEMENTS")
  return (
    <div className={styles2.page}>
      <header>
        <div className={styles.headerLogo} onClick={()=>{window.location.href = "/"}}>
          <img src={"http://localhost:8000/image/logo.png"} alt="Logo" width={47} height={47} />
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
            {data.map((res, idx) => {
              return (
                <div className={styles2.achievement} key={idx}>
                  <h3 className={styles2.achievementName}> {res.name} </h3>
                  <div>
                    <Image loader={() => `http://localhost:8000/image/message_icon_achievements.png`} src={"http://localhost:8000/image/message_icon_achievements.png"} width={111} height={111} />
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
              <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
              <label className="form-check-label text-white" htmlFor="flexCheckDefault">
                1 filter
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
              <label className="form-check-label text-white" htmlFor="flexCheckDefault">
                2 filter
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="flexCheckDefault" />
              <label className="form-check-label text-white" htmlFor="flexCheckDefault">
                3 filter
              </label>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Number(stats.sentMessages) >= 100 ? styles.greenProgress:styles.yellowProgress

{/* <div className={styles2.achievement}>
          <h3 className={styles2.achievementName}> Send 100 messages </h3>
          <div>
          <Image loader={() => `http://localhost:8000/image/message_icon_achievements.png`} src={"http://localhost:8000/image/message_icon_achievements.png"} width={111} height={111} />  
          </div>
          <hr className={styles2.progressBar}/>
          <h4 className={styles2.progressValue}> 77/100 </h4>
    </div> */}

//  <progress id={Number(stats.sentMessages) >= 100 ? "greenProgress":"yellowProgress"} max={100} value={stats.sentMessages}> Completed </progress>