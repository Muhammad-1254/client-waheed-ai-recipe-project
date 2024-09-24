import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';
import swaggerDocs from './utils/swagger.js';

dotenv.config({
    path:"./.env"
});

connectDB()
.then(()=>{
    const PORT = process.env.PORT || 8000;
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
    swaggerDocs(app,PORT);
})
.catch((error)=>{
    console.error("Server failed to start: ",error);
    process.exit(1);
})


