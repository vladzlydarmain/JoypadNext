import Image from "next/image";
import styles from "./ranking.css";
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';    
import { useRouter } from "next/router";

export default function Ranking(){
    return (
        <div className='page'>
            <header>
                <div className="headerLogo">
                  <Image loader={() => `http://localhost:8000/image/logo.png`} src={"http://localhost:8000/image/logo.png"} alt="Logo" width={47} height={47} />
                  <span className="logo">Joypad</span>
                </div>
                <div className="headerButtons">
                  <button className="transperentButton">Home</button>
                  <button className="transperentButton">Chat</button>
                </div>
            </header>
            <main className='mainBody'>
                <div className='sideBar'>
                    <div className="backAndImage">
                    <Image loader={() => `http://localhost:8000/image/strelka_left.png`} src={"http://localhost:8000/image/strelka_left.png"} width={36} height={36} />  
                        <h3>
                            Back
                        </h3>
                    </div>
                    <div className='menuSelector'>
                        <div>
                            <button className="sideBarButtons">
                            <Image loader={() => `http://localhost:8000/image/user2.png`} src={"http://localhost:8000/image/user2.png"} width={36} height={36} />  
                                Profile
                            </button>
                        </div>
                        <div>
                            <button className="sideBarButtons" >
                            <Image loader={() => `http://localhost:8000/image/ranking1.png`} src={"http://localhost:8000/image/ranking1.png"} width={36} height={36} />  
                                Ranking
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="groupsTitle">
                    <h2> GROUPS </h2>
                    </div>
                    <div>
                        <div className="ratingGroup">
                            <div className="placeAndGroupName">
                            <h3> 1# </h3>
                            <h3 className="groupName"> DotaGaming </h3>
                            </div>
                            <div className="points">
                            <h6> Points: 6.000 </h6>
                            </div>                            
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}


