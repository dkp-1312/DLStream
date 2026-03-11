import React, { useState, useEffect, useRef } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
import { socket } from "../socket";

const ChatRoom = ({ roomName }) => {
    const { authUser } = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.connect();
        socket.emit("joinRoom", roomName);

        const handleReceiveMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        const handleStreamEnded = ({ message }) => {
            alert(message); // Notify users that the stream has ended
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("streamEnded", handleStreamEnded);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("streamEnded", handleStreamEnded);
        };
    }, [roomName]);

    // Scroll to the bottom of the chat on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && authUser) {
            const messageData = {
                text: newMessage,
                room: roomName,
                sender: authUser.fullName || "Anonymous",
                timestamp: new Date().toLocaleTimeString(),
            };
            console.log("Sending message:", messageData);
            socket.emit("sendMessage", { room: roomName, message: messageData });
            setNewMessage("");
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-5/12 max-w-2xl mx-auto border rounded-lg shadow-lg">
            <h2 className="p-4 border-b text-xl font-bold">Chat Room: {roomName}</h2>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                        <span className="font-bold">{msg.sender}: </span>
                        <span>{msg.text}</span>
                        <span className="text-xs text-gray-500 ml-2">{msg.timestamp}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t flex">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="input input-bordered flex-grow mr-2"
                    placeholder="Type a message..."
                />
                <button type="submit" className="btn btn-primary">
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatRoom;