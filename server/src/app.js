

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


// routes import 
import userRouter from './routes/user.route.js'
import gptRouter from './routes/gpt.route.js'


const app = express();

app.use(cors({
  origin:[JSON.parse(process.env.ALLOWED_ORIGINS)],
  credentials: true,
  methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders:'Content-Type,Authorization',
}));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(`/api/v1/users`, userRouter);
app.use('/api/v1/gpt', gptRouter);


// health checker
app.get('/api/v1/health', (req, res) => {
  res.send('Server is up and running');
});
app.get('/api/v1/temp', (req, res) => {
  res.send('temp');
});





export {app}