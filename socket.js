"use client";

import { io } from "socket.io-client";

export const socket = io("https://joypadapi.onrender.com/");