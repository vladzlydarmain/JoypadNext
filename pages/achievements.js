import Image from "next/image";
// import 'bootstrap/dist/css/bootstrap.css';
import styles2 from "./achievements.module.css";
import styles from "../app/page.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Achievements() {
  const [data, setData] = useState()
  const token = Cookies.get("token")

  useEffect(() => {
    console.log("FETCH -1")
    if (!token || token == null || token == "undefined") {
      window.location.href = "http://localhost:8000/user/auth"
    }
    console.log("FETCH 0")
    if (!data) {
      console.log("FETCH 1")
      fetch("http://localhost:8000/achievements/user/", {
        method: "GET",
        headers: {
          token: token
        }
      }).then((response) => {
        console.log("FETCH 2")
        return response.json()
      }).then((resp) => {
        console.log("FETCH 3")
        console.log(resp)
        setData(resp.achievement)
        console.log("THIS IS DATA", data)
      })
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
        <div className={styles.headerLogo}>
          <Image loader={() => `http://localhost:8000/image/logo.png`} src={"http://localhost:8000/image/logo.png"} alt="Logo" width={47} height={47} />
          <h3 className={styles.logo}>Joypad</h3>
        </div>
        <div className={styles.headerButtons}>
          <button className={styles.transperentButton}>Home</button>
          <button className={styles.transperentButton}>Chat</button>
          <button className={styles.whiteButton}>Start</button>
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
                  <hr className={styles2.progressBar} />
                  <h4 className={styles2.progressValue}> 77/100 </h4>
                </div>
              )
            })}
          </div>
        }
      </main>
    </div>
  );
}

{/* <div className={styles2.achievement}>
          <h3 className={styles2.achievementName}> Send 100 messages </h3>
          <div>
          <Image loader={() => `http://localhost:8000/image/message_icon_achievements.png`} src={"http://localhost:8000/image/message_icon_achievements.png"} width={111} height={111} />  
          </div>
          <hr className={styles2.progressBar}/>
          <h4 className={styles2.progressValue}> 77/100 </h4>
    </div> */}