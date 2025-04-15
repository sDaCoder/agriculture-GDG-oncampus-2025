"use client"
import { SignInButton, SignUpButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Home() {
  
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/py/hello');
      const data = await response.json();
      setMessage(data.message);
    }
    fetchData();
  },[])
  
  return (
    <>
      <div className="text-blue-700">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <h1>This is an API Call</h1>
        <h2 className="font-bold">Message from Python: {message}</h2>
      </div>
    </>
  );
}