"use client";
import ChatArea from "@/components/ChatArea/ChatArea";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const page = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()){
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
  
  // Auto-scroll to bottom when messages change
  const messagesEndRef = useRef(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  

  return (
    <>
      <div className="mx-auto p-4">
        <Header />
        <ChatArea chat={chat} messagesEndRef={messagesEndRef} />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex gap-2 border p-6 rounded-lg shadow-md max-w-[80vw] mx-auto">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-black border-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message here..."
            />
            <Button onClick={sendMessage} className="bg-green-700 text-white py-6 rounded-full"> 
              <Send /> 
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-center select-none">
            <span className="text-red-500">Note: </span>
            This is a demo version of aGroww AI. Please do not share any sensitive information.
            <br />
            AI responses are generated based on the input provided and may not always be accurate.
            <br />
          </div>
        </div>
      </div>
    </>
  )
}

export default page