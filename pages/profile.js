"use client"

import Image from "next/image";
import styles from "./profile.css";
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';    
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    const token = Cookies.get("token")
    const [info,setInfo] = useState()
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
                    console.log(resp.info)
                })
            }
        }
    })
    return (
        <div className="main_page">

        
        <header>
            <div className="headerLogo">
              <Image loader={() => `http://localhost:8000/image/logo.png`} src={"http://localhost:8000/image/logo.png"} alt="Logo" width={47} height={47} />
              <h3 className="logo">Joypad</h3>
            </div>

            <div className="headerButtons">

              <button className="transperentButton">Home</button>
              <button className="transperentButton">Chat</button>

            </div>
        </header>
            <div className="main_profile">
                <div className="double_main">
                    <div className="menu_bar">
                        <div className="object-top">
                            <Image loader={() => `http://localhost:8000/image/strelka_left.png`} src={"http://localhost:8000/image/strelka_left.png"} alt="left" width={36} height={36} />
                            <h3>Back</h3>
                        </div>
                    </div>
                    <div className="menu_profile">
                    </div>
                </div>
            </div>
        </div>
    )
}


                {/* {info && 
                    <div>
                        {info.name}
                        <Image loader={()=>info.avatar} src={info.avatar} width={300} height={300}/>
                    </div>
                } */}