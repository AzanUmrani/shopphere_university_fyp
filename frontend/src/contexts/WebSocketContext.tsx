// import React, { createContext, useContext, useEffect, useState } from "react";
// import webSocketService from "../services/websocket";
// import { useAppSelector } from "../hooks/redux";

// interface WebSocketContextType {
//   isConnected: boolean;
//   connectionError: string | null;
//   reconnect: () => void;
//   disconnect: () => void;
// }

// const WebSocketContext = createContext<WebSocketContextType | undefined>(
//   undefined
// );

// export const useWebSocketContext = () => {
//   const context = useContext(WebSocketContext);
//   if (!context) {
//     throw new Error(
//       "useWebSocketContext must be used within WebSocketProvider"
//     );
//   }
//   return context;
// };

// interface WebSocketProviderProps {
//   children: React.ReactNode;
// }

// export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
//   children,
// }) => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [connectionError, setConnectionError] = useState<string | null>(null);

//   const { token } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     // Set up WebSocket event listeners
//     const unsubscribeConnected = webSocketService.on("connected", () => {
//       setIsConnected(true);
//       setConnectionError(null);
//     });

//     const unsubscribeDisconnected = webSocketService.on("disconnected", () => {
//       setIsConnected(false);
//     });

//     const unsubscribeError = webSocketService.on(
//       "connectionError",
//       (error: any) => {
//         setConnectionError(error?.message || "Connection failed");
//       }
//     );

//     return () => {
//       unsubscribeConnected();
//       unsubscribeDisconnected();
//       unsubscribeError();
//     };
//   }, []);

//   useEffect(() => {
//     // Update auth token when user logs in/out
//     if (token) {
//       webSocketService.updateAuthToken(token);
//     } else {
//       webSocketService.disconnect();
//     }
//   }, [token]);

//   const reconnect = () => {
//     webSocketService.reconnect();
//   };

//   const disconnect = () => {
//     webSocketService.disconnect();
//   };

//   return (
//     <WebSocketContext.Provider
//       value={{
//         isConnected,
//         connectionError,
//         reconnect,
//         disconnect,
//       }}
//     >
//       {children}
//     </WebSocketContext.Provider>
//   );
// };
