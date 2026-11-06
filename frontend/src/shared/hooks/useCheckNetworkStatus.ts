import { useEffect } from "react";
import { useAuthStore } from "../../features/auth/stores/auth.store";
import { socket } from "../api/socket-client";

export function useCheckNetworkStatus(): void {
    const {isAuthenticated} = useAuthStore(state=>state)
    useEffect(() => {
            if (!isAuthenticated) return;
    
            if (!socket.connected) {
                socket.connect();
            }
    
            const handleConnect = () => {
                socket.emit("chat:presence:enter");
            };
    
            socket.on("connect", handleConnect);
            socket.emit("chat:presence:enter");
    
            return () => {
                socket.emit("chat:presence:leave");
                socket.off("connect", handleConnect);
            };
        }, [isAuthenticated]);

}
