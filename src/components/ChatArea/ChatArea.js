import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import Markdown from 'react-markdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUser } from '@/actions/userActions'

const ChatArea = ({chat}) => {

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).replace('am', 'AM').replace('pm', 'PM');
    }

    // Fetching the details of the logged in user
    const [user, setUser] = useState(null)
    useEffect(() => {
      const fetchUser = async () => {
        const user = await getUser()
        setUser(user)
      }
      fetchUser()
    }, [])

    const messagesEndRef = useRef(null)
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chat])
    
    
  return (
    <>
     <ScrollArea>
          <div className="bg-gray-50  md:h-[65vh] h-[70vh] max-w-[80vw] mx-auto overflow-y-auto p-3 space-y-10 py-6 rounded shadow ">
            {chat?.map((msg, idx) => (
                // Displaying the messages
                <div key={idx} className={`flex items-start gap-4 my-2 ${msg.sender === "user" ? "text-right justify-end" : "text-left justify-start"}`}>
                  {msg.sender === "bot" && 
                    <Avatar className='hidden md:block'>
                      <AvatarImage src="https://i.pravatar.cc/100?img=70" alt="@shadcn" />
                      <AvatarFallback>Kissan AI</AvatarFallback>
                    </Avatar>
                  }

                  <div>
                    <div className={`md:text-md text-sm shadow-md flex flex-col gap-y-2 max-w-[70vw] min-w-[20vw] px-6 py-4 rounded-xl ${msg.sender === "user" ? "bg-green-700 rounded-tr-none text-background" : "bg-slate-200 rounded-tl-none text-foreground"}`}>
                      <h2 className='font-bold'>{msg.sender === "user" ? `${`${user?.firstName} ${user?.lastName}` || user?.username}` : "Kissan AI"}</h2>
                      <Markdown>{msg.message}</Markdown>
                    </div>
                    <span className={`text-xs p-4 text-black ${msg.sender === "user" ? "text-background self-end" : "text-foreground self-start"}`}>
                      {formatTime(new Date(msg.timestamp))}
                    </span>
                  </div>

                  {msg.sender === "user" && 
                    <Avatar className='hidden md:block'>
                      <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                      <AvatarFallback>{user?.firstName}</AvatarFallback>
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
