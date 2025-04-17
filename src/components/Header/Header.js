import React from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
import Link from 'next/link'

const Header = () => {
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
                            <Button onClick={() => window.location.href = "/sign-in"}>Sign In</Button>
                        </div>
                    </SignedOut>
                </div>
            </div>
        </>
    )
}

export default Header
