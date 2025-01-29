import express from 'express';
import mongoose from 'mongoose';
import {faker} from '@faker-js/faker';
import tokens from "./routes/Tokens.js";


const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/prg06-tokens');

app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Staat toegang toe vanaf andere origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Alle methodes toestaan
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, Accept, Authorization' // Zorgt dat clients de juiste headers mogen meesturen
    );
    next();
});



app.use((req, res, next) => {
    // Check Accept header
    const acceptHeader = req.headers.accept;
    // console.log(`Client accepteert: ${acceptHeader}`);
    console.log(acceptHeader);

    // Check if the client accepts JSON
    if (acceptHeader !== 'application/json' && req.method !== 'OPTIONS') { //  // Als de aanvraag geen JSON verwacht én het geen OPTIONS-aanvraag is,
        // res.json({message: 'Dit is een JSON-response'});
        return res.status(406).send('This webservice only accepts JSON');
    }
    next();
});

app.use(express.json()); //middleware voor JSON-gegevens
app.use(express.urlencoded({ extended: true }));
app.use('/tokens', tokens);


app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});

