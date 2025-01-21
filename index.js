import express from 'express';
import mongoose from 'mongoose';
import Note from "./models/token.js";
import {faker} from '@faker-js/faker';
import tokens from "./routes/tokens.js";


const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/prg06-tokens');

app.use("/", (req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, Content-Type, Authorization, Accept');
    next();
});

app.use((req, res, next) => {
    // Check Accept header
    const acceptHeader = req.headers.accept;
    // console.log(`Client accepteert: ${acceptHeader}`);
    console.log(acceptHeader);

    if (acceptHeader !== 'application/json') {
        // res.json({message: 'Dit is een JSON-response'});
        return res.status(406).send('Not Acceptable');
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/tokens', tokens);





app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});

