"use client";
import { useState } from "react";
import Markdown from 'react-markdown'

const page = () => {
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { type: "user", text: input };
    setChat([...chat, userMessage]);
    setInput("");

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
      console.log("Response:", data);
      
      const botMessage = { type: "bot", text: data.message };
      setChat((prev) => [...prev, botMessage]);

    } catch (err) {
      console.error("Error:", err);
    }
  };


  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">aGroww AI</h1>
        <div className="bg-gray-100 h-[400px] overflow-y-auto p-3 rounded shadow mb-4">
          {chat.map((msg, idx) => (
            <div key={idx} className={`my-2 ${msg.type === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block p-2 rounded-2xl ${msg.type === "user" ? "bg-green-600" : "bg-blue-500"}`}>
                <Markdown>{msg.text}</Markdown>
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2 text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message here..."
          />
          <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-2 rounded"> Send </button>
        </div>
      </div>
    </>
  )
}

export default page
