"use client";
import ChatArea from "@/components/ChatArea/ChatArea";
import ChatInputBox from "@/components/ChatInputBox/ChatInputBox";
import Warnings from "@/components/Warnings/Warnings";
import { useState, useEffect } from "react";

const page = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) {
      setInput(input.trim());
      return;
    }
    const userMessage = {
      sender: "user",
      message: input,
      timestamp: new Date().toISOString(),
    };

    // Showing up the message in the UI
    setChat([...chat, userMessage]);
    setInput("");

    // Saving the user message in the bot
    await fetch("/api/py/chat/save", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userMessage),
    }).catch((err) => {
      console.error("Error saving message:", err);
    })

    // Fetching the bot response from FastAPI
    try {
      const res = await fetch("/api/py/chat", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error:", errorText);
        throw new Error("Server Error: " + errorText);
      }
      const data = await res.json();

      const botMessage = {
        sender: "bot",
        message: data.message,
        timestamp: new Date().toISOString(),
      };
      // Show up the bot message in the UI
      setChat((prev) => [...prev, botMessage]);
      // Saving the bot message in the database
      await fetch("/api/py/chat/save", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(botMessage),
      })

    } catch (err) {
      console.error("Error:", err);
    }

  };

  useEffect(() => {
    // Fetching the chat history from the database
    const fetchChatHistory = async () => {
      try {
        const res = await fetch("/api/py/chat/all");
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setChat(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    }
    fetchChatHistory();
  }, []);




  return (
    <>
      <div className="container mx-auto">
        {/* <Header /> */}
        <ChatArea chat={chat} />
        
        <div className="md:static absolute bottom-0 w-full py-4">
          <ChatInputBox input={input} setInput={setInput} sendMessage={sendMessage} />
          <Warnings />
        </div>
      </div>
    </>
  )
}

export default page