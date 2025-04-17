"use server"
import { currentUser } from '@clerk/nextjs/server'

export const getUser = async () => {
    const user = await currentUser()
    return JSON.parse(JSON.stringify(user))
}