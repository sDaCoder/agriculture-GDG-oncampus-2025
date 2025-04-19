"use client"
import { getUser } from "@/actions/userActions";
import { Button } from "@/components/ui/button";
import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const [user, setUser] = useState(null)
  const router = useRouter()
  
  if(user !== null) {
    console.log(user, user?.firstName);
  }
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  return (
    <>
      {/* <div className="text-blue-700">
        <h1>This is an API Call</h1>
        <Link href="/chat">Click me to chat</Link>
      </div> */}

      
      <div className="h-[50vh] flex flex-col items-center justify-center">
        <SignedIn>
          <h1 className="text-5xl text-slate-500 font-bold">Welcome Back</h1>
          <h2 className="text-5xl text-slate-500 font-bold">{user?.firstName || user?.username}</h2>
          <Button onClick={() => router.push("/chat")} className='bg-green-700 hover:bg-green-900 my-4'>Start Chatting</Button>
        </SignedIn>

        <SignedOut>
            <Button onClick={() => router.push("/chat")} className='bg-green-700 hover:bg-green-900'>Get Started for free</Button>
        </SignedOut>
      </div>
      
    </>
  );
}
