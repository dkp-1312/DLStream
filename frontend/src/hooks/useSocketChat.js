import { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
import { socket } from "../socket";
import { toast } from "react-hot-toast";
/**
 * Socket.io chat for a room. Stream keys and meeting room names are different
 * `room` values — same protocol, separate channels.
 */
export function useSocketChat(roomName) {
  const { authUser } = useAuthContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomName) return;

    socket.connect();
    socket.emit("joinRoom", roomName);

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleStreamEnded = ({ message }) => {
      toast(message);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("streamEnded", handleStreamEnded);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("streamEnded", handleStreamEnded);
    };
  }, [roomName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomName) return;

    const senderName = authUser?.fullName || authUser?.displayName || "Anonymous";
    const messageData = {
      text: newMessage.trim(),
      room: roomName,
      sender: senderName,
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit("sendMessage", { room: roomName, message: messageData });
    setNewMessage("");
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    messagesEndRef,
    canSend: true,
  };
}
