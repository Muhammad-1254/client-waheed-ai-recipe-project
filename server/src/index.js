import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
dotenv.config({
    path:"./.env"
});

connectDB()
.then(()=>{
    const PORT = process.env.PORT ;
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
    
})
.catch((error)=>{
    console.error("Server failed to start: ",error);
    process.exit(1);
})




