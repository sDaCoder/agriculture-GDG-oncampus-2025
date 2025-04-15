import React from 'react'
import { SignedIn, UserButton } from '@clerk/nextjs'

const Header = () => {
    return (
        <>
            <div className="flex items-center justify-around">
                <h1 className="text-2xl text-slate-500 font-bold mb-4 cursor-pointer" onClick={() => window.location.href = "/"}>aGroww AI</h1>
                <div className='mb-2'>
                    <SignedIn>
                        <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }}/>
                    </SignedIn>
                </div>
            </div>
        </>
    )
}

export default Header
