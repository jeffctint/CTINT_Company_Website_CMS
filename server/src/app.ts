import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const port = 8000;

const app:Express = express();

app.get("/", (req, res) => {
    res.send("Hello from express server")


})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})