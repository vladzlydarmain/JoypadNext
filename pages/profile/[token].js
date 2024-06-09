"use client"

import Image from "next/image";
// import styles from "../app/page.module.css";
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';    
import { useRouter } from "next/router";

export default function Home() {
    const router = useRouter();
    const token = router.query.token
    const cookieToken = Cookies.get("token")
    
    if(!cookieToken || cookieToken == null || cookieToken == "undefined"){
        console.log(token)
        Cookies.set("token",token)
    }
        
    useEffect(()=>{
        router.push("/profile/")
    })
}