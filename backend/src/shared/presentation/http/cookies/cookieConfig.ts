import { CookieOptions } from "express";




export const accessTokenCookie: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 5 * 24 * 60 * 60 * 1000,
    path: "/"
}



export const registrationCookie: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
    path: "/"
}

