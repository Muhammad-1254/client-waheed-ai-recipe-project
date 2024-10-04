

export const cookiesOptions={
    httpOnly: process.env.NODE_ENV === "production",
    sameSite:"None",
    secure: process.env.NODE_ENV === "production",
    maxAge: process.env.NODE_ENV === "production" ? 1000*60*60*24*7 : 0,
}