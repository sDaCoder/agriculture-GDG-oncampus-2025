"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Markdown from 'react-markdown'

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
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).replace('am', 'AM').replace('pm', 'PM');
  }

  // Auto-scroll to bottom when messages change
  const messagesEndRef = useRef(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat])

  return (
    <>
      <div className="mx-auto p-4">
        <h1 className="text-2xl text-slate-500 font-bold mb-4">aGroww AI</h1>
        <ScrollArea>
          <div className="bg-gray-50 h-[65vh] max-w-[80vw] mx-auto overflow-y-auto p-3 space-y-10 py-6 rounded shadow mb-4">
            {chat?.map((msg, idx) => (
                // Displaying the messages
                <div key={idx} className={`flex items-start gap-4 my-2 ${msg.sender === "user" ? "text-right justify-end" : "text-left justify-start"}`}>
                  {msg.sender === "bot" && 
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/100?img=70" alt="@shadcn" />
                      <AvatarFallback>BOT</AvatarFallback>
                    </Avatar>
                  }

                  <span className={`shadow-md flex flex-col gap-y-2 max-w-[60vw] px-6 py-4 rounded-xl ${msg.sender === "user" ? "bg-green-500 rounded-tr-none text-background" : "bg-slate-200 rounded-tl-none text-foreground"}`}>
                    <Markdown>{msg.message}</Markdown>
                    <span className={`text-xs pt-4 ${msg.sender === "user" ? "text-background self-end" : "text-foreground self-start"}`}>
                      {formatTime(new Date(msg.timestamp))}
                    </span>
                  </span>

                  {msg.sender === "user" && 
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/100?img=60" alt="@shadcn" />
                      <AvatarFallback>USER</AvatarFallback>
                    </Avatar>
                  }
                </div>
            ))}
            <div ref={messagesEndRef} ></div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex gap-2 border p-6 rounded-lg shadow-md max-w-[80vw] mx-auto">
            <input
              className="flex-1 border rounded-lg px-3 py-2 text-black border-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message here..."
            />
            <Button onClick={sendMessage} className="bg-green-500 hover:bg-green-800 text-white py-6 rounded-full"> 
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