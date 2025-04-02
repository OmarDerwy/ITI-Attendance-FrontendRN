import React, { useState, useEffect } from "react";
import WebSocket from "react-native-websocket";
import * as storage from "expo-secure-store";

const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await storage.getItemAsync("token");
      console.log("Fetched token:", storedToken); // Debug log
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const handleOpen = () => {
    console.log("Connected to WebSocket");
    setIsConnected(true);
  };

  const handleMessage = (msg) => {
    const parsedMessage = JSON.parse(msg.data);
    console.log("Message from server: ", parsedMessage);
    setMessages((prevMessages) => [...prevMessages, parsedMessage]);
  };

  const handleError = (err) => {
    console.error("WebSocket error: ", err);
  };

  const handleClose = () => {
    console.log("WebSocket connection closed");
    setIsConnected(false);
  };

  return {
    WebSocketComponent: token ? (
      <WebSocket
        url={url}
        headers={{ Authorization: `Bearer ${token}` }}
        onOpen={handleOpen}
        onMessage={handleMessage}
        onError={handleError}
        onClose={handleClose}
      />
    ) : null,
    messages,
    isConnected,
  };
};

const App = () => {
  const { WebSocketComponent } = useWebSocket("ws://yourserver.com/ws/notifications/");

  return (
    <>
      {WebSocketComponent}
      {/* <YourOtherComponents /> */}
    </>
  );
};

export default App;