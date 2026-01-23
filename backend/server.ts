import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import urlRouter from './routes/url_route';
import { updateLastUsedJob } from './jobs/lastUsed_updation_job';

dotenv.config()

const app = express()
const server = http.createServer(app)
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Hi!! from server side")
})

app.use('/api/url',urlRouter);

// Jobs
updateLastUsedJob();

server.listen(8000,()=>{
    console.log("The server is listening at 8000");
})
