"use client"
{/* <Image loader={() => `http://localhost:3001/image/logo.png`} src={"http://localhost:3001/image/logo.png"} alt="Logo" width={47} height={47} /> */}
{/* <Image loader={() => `http://localhost:3001/image/Illustration_main.png`} src={"http://localhost:3001/image/Illustration_main.png"} alt="Gaming Illustration" width={590} height={707} /> */}
{/* <Image loader={() => `http://localhost:3001/image/achivemens.png`} src={"http://localhost:3001/image/achivemens.png"} alt="Gaming Illustration" width={461} height={337} /> */}
{/* <Image loader={() => `http://localhost:3001/image/main_message.png`} src={"http://localhost:3001/image/main_message.png"} alt="Gaming Illustration" width={717} height={247} /> */}

import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.mainBody}>
      <header className={styles.header}>
        <div className={styles.headerLogo} onClick={()=>{window.location.href = "/"}}>
          <Image loader={() => `http://localhost:8000/image/logo.png`} src={"http://localhost:8000/image/logo.png"} alt="Logo" width={47} height={47} />
          <h3 className={styles.logo}>Joypad</h3>
        </div>

        <div className={styles.headerButtons}>

          <button className={styles.transperentButton} onClick={()=>{window.location.href="/"}}>Home</button>
          <button className={styles.transperentButton} onClick={()=>{window.location.href="/chat/"}}>Chat</button>
          <button className={styles.whiteButton}>Start</button>

        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mnn}>
          <div className={styles.mainHalf}>
            <div className={styles.mainTextBlock}>
              <h1 className={styles.whiteText}>Unlock the Future<br/>of Gaming</h1>
              <h4 className={styles.greyText}>Відкрийте для себе найкращу ігрову платформу</h4>
              <button className={styles.purpleButton} onClick={()=>{window.location.href = "http://localhost:3000/profile"}}>Приєднуйся зараз</button>
            </div>
          </div>
          <div className={styles.mainHalf}>
            <Image className={styles.mainImageBlock} loader={() => `http://localhost:8000/image/main_image_message.png`} src={"http://localhost:8000/image/main_image_message.png"} alt="Gaming Illustration" width={657} height={787} />
          </div>
        </div>
      </main>

      <footer>
        <div className={styles.mainPageSector}>

          <div className={styles.sectorHalfLeft}>
            <div className={styles.forCubes}>
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="23" height="23" rx="4" fill="white"/></svg>
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="23" height="23" rx="4" fill="white"/></svg>
            </div>
            <h3 className={styles.whiteGreyText}>Elevate Your Gaming Experience with Our Comprehensive Statistics Tracking and Management Tools</h3>
          </div>
          <div className={styles.sectorHalfRight}>
            <h4 className={styles.whiteGreyText}>get more emotions in a group with friends</h4>
            <h2 className={styles.whiteText}>Best Experiences</h2>
          </div>

        </div>

        <div className={styles.steamBlock}>Discover the Seamless Integration of Steam</div>

        <div className={styles.mainPageSector}>
          <div className={styles.sectorHalfLeft}>
            <div className={styles.forCubes}>
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="23" height="23" rx="4" fill="white"/></svg>
            </div>
            <h3 className={styles.whiteGreyText}>In the achievement system, you can evaluate your gaming skills by earning points in games and chatting with other players.</h3>
          </div>

          <div className={styles.sectorHalfRight}>
            <Image loader={() => `http://localhost:8000/image/achivemens.png`} src={"http://localhost:8000/image/achivemens.png"} alt="achivemens" width={461} height={337} />
          </div>
        </div>

        <div className={styles.mainPageSector}>
          <div className={styles.sectorHalfLeft}>
            <Image loader={() => `http://localhost:8000/image/main_message.png`} src={"http://localhost:8000/image/main_message.png"} alt="main_message" width={717} height={247} />
            <div className={styles.purpleBlock}>
              Elevate Your Gaming Experience
            </div>
          </div>

          <div className={styles.sectorHalfRight}>
            <button className={styles.whiteButton}>Start</button>
            <h5 className={styles.darkGreyText}>Unlock the Full Potential</h5>
          </div>
        </div>

        <div className={styles.mainPageSector}>
          <div className={styles.sectorHalfLeft}>
            <div className={styles.forCubes}>
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="23" height="23" rx="4" fill="white"/></svg>
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="23" height="23" rx="4" fill="white"/></svg>
            </div>
            <h3 className={styles.whiteGreyText}>The simplest gaming platform for groups or companies. Create gaming sessions, invite friends and colleagues, enjoy cooperative games and improve team spirit.</h3>
          </div>

          <div className={styles.sectorHalfRight}>
            <Image loader={() => `http://localhost:8000/image/main_girl.png`} src={"http://localhost:8000/image/main_girl.png"} alt="main_girl" width={461} height={337} />
          </div>
        </div>

        <div className={styles.mainPageSector}>
          <div className={styles.sectorHalfLeft}>
            <Image loader={() => `http://localhost:8000/image/main_cosmonaft.png`} src={"http://localhost:8000/image/main_cosmonaft.png"} alt="main_cosmonaft" width={556} height={698} />
          </div>

          <div className={styles.sectorHalfLeft}>
            <div className={styles.forCubes}>
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="23" height="23" rx="4" fill="white"/></svg>
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="23" height="23" rx="4" fill="white"/></svg>
            </div>
            <h3 className={styles.whiteGreyText}>"The simplest gaming platform for groups or companies. Chat in groups with friends, create news channels or events, and much more."</h3> 
          </div>
        </div>
      </footer>
    </div>
  );
}
