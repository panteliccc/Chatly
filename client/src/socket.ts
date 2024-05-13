import { io } from "socket.io-client";

const URL = "https://chatly-sqn9.onrender.com";

export const socket = io(URL);