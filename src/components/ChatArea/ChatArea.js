import React from 'react'
import { ScrollArea } from '../ui/scroll-area'
import Markdown from 'react-markdown'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const ChatArea = ({chat, messagesEndRef}) => {

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).replace('am', 'AM').replace('pm', 'PM');
    }
    
  return (
    <>
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

                  <span className={`shadow-md flex flex-col gap-y-2 max-w-[60vw] px-6 py-4 rounded-xl ${msg.sender === "user" ? "bg-green-700 rounded-tr-none text-background" : "bg-slate-200 rounded-tl-none text-foreground"}`}>
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
    </>
  )
}

export default ChatArea
