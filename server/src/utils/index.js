

export const cookiesOptions={
    httpOnly: process.env.NODE_ENV === "production",
    sameSite:process.env.NODE_ENV === "production"?"None":"Lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
}

export const print = (...args)=>{
    process.env.NODE_ENV === "development" && console.log(...args);
}