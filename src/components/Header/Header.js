"use client"
import React from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Header = () => {
    const router = useRouter()
    return (
        <>
            <div className="flex items-center justify-around mt-2">
                <h1 className="text-2xl text-slate-500 font-bold mb-4 cursor-pointer">
                    <Link href={"/"}>aGroww AI</Link>
                </h1>
                <div className='mb-2'>
                    <SignedIn>
                        <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }}/>
                    </SignedIn>
                    <SignedOut>
                        <div className="flex items-center gap-x-4">
                            {/* <Button><Link href={"/sign-in"}>Sign In</Link></Button> */}
                            <Button onClick={() => router.push("/sign-in")} className="bg-green-700 hover:bg-green-900 py-2 px-8 font-semibold">
                                Log In
                            </Button>
                            <Button onClick={() => router.push("/sign-up")} className="bg-green-700 hover:bg-green-900 py-2 px-8 font-semibold">
                                Sign Up
                            </Button>
                        </div>
                    </SignedOut>
                </div>
            </div>
        </>
    )
}

export default Header
