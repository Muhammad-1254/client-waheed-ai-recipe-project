import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import { print } from './utils/index.js';
dotenv.config({
    path:"./.env"
});

connectDB()
.then(()=>{
    const PORT = process.env.PORT ;
    app.listen(PORT,()=>{
        print(`Server running on port ${PORT}`);
    })
    
})
.catch((error)=>{
    console.error("Server failed to start: ",error);
    process.exit(1);
})






