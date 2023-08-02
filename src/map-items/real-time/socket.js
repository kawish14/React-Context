import io from "socket.io-client";
import { ENDPOINT } from "../../url";
const socket = io(ENDPOINT);

export {socket}

