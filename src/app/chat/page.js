"use client";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import Markdown from 'react-markdown'

const page = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
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
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">aGroww AI</h1>
        <div className="bg-gray-100 h-[400px] overflow-y-auto p-3 space-y-10 py-6 rounded shadow mb-4">
          {chat?.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-2 my-2 ${msg.sender === "user" ? "text-right justify-end" : "text-left justify-start"}`}>
              {msg.sender === "bot" && <div className="bg-gray-500 h-8 w-8 rounded-full inline-block">A</div>}
              <span className={`inline-block text-white p-6 py-3 rounded-2xl ${msg.sender === "user" ? "bg-green-500 rounded-tr-none" : "bg-blue-500 rounded-tl-none max-w-[40vw]"}`}>
                <Markdown>{msg.message}</Markdown>
              </span>
              {msg.sender === "user" && <div className="bg-gray-500 h-8 w-8 rounded-full inline-block">A</div>}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-lg px-3 py-2 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage} className="bg-green-500 text-white px-4 py-2 rounded-lg"> <Send /> </button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center select-none">
          <span className="text-red-500">Note:</span> 
          This is a demo version of aGroww AI. Please do not share any sensitive information.
          <br />
          AI responses are generated based on the input provided and may not always be accurate.
          <br />
        </div>
      </div>
    </>
  )
}

export default page
