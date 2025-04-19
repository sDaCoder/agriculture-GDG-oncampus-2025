import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ChatInputBox = ({input, setInput, sendMessage}) => {
  return (
    <>
     <div className="flex gap-2 border p-4 rounded-full shadow-md max-w-[80vw] mx-auto">
          <input
            className="flex-1 border rounded-lg px-3 py-2 text-black border-none outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message here..."
          />
          <Button onClick={sendMessage} className="bg-green-700 text-white py-6 rounded-full">
            <Send />
          </Button>
        </div> 
    </>
  )
}

export default ChatInputBox
