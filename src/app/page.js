"use client"
import { getUser } from "@/actions/userActions";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

export default function Home() {
  
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/py/chat');
      const data = await response.json();
      setMessage(data.message);
    }
    fetchData();
  },[])

  const [user, setUser] = useState(null)
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
      <Header />
      <div className="text-blue-700">
        <h1>This is an API Call</h1>
        <SignedIn>
          <Link href="/chat">Click me to chat</Link>
        </SignedIn>
        <SignedOut>
          <a href={user ? "/chat" : "/sign-in"}>Click me to chat</a>
        </SignedOut>
        {/* <h2 className="font-bold">Message from Python: {message}</h2> */}
      </div>

      
      <div className="h-[50vh] flex flex-col items-center justify-center">
        <SignedIn>
          <h1 className="text-5xl text-slate-500 font-bold">Welcome Back</h1>
          <h2 className="text-5xl text-slate-500 font-bold">{user?.firstName || user?.username}</h2>
        </SignedIn>

        <SignedOut>
            <Button onClick={() => window.location.href = "/sign-in"}>Get Started for free</Button>
        </SignedOut>
      </div>
      
    </>
  );
}
