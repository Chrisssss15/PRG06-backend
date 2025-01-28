import express from "express";
import Token from "../models/Token.js";
import {faker} from "@faker-js/faker";
import token from "../models/Token.js";

const router = express.Router();



// OPTIONS (overview)
router.options('/', async (req, res) => {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS']);
    res.status(204).send();
});

// OPTIONS (detail)
router.options('/:id', async (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, PATCH, OPTIONS');
    res.status(204).send();
});

// -----------------------------------------------------

// GET ALL TOKENS
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100; // Default limit is 10
        const page = parseInt(req.query.page) || 1;    // Default page is 1
        const skip = (page - 1) * limit; // Skip the first {skip} items

        const totalItems = await Token.countDocuments(); // Totale aantal items
        const tokens = await Token.find({}).skip(skip).limit(limit); // Find all tokens

        const totalPages = Math.ceil(totalItems / limit); // Totaal aantal pagina's


        res.status(200).json(
            {
                "items": tokens,
                "_links": {
                    "self": {
                        "href": `${process.env.BASE_URL}/tokens`
                    },
                    "collection": {
                        "href": `${process.env.BASE_URL}`
                    }
                },
                pagination: {
                    currentPage: page,
                    currentItems: tokens.length,
                    totalPages: totalPages,
                    totalItems: totalItems,
                    _links: {
                        first: {
                            page: 1,
                            href: `${process.env.BASE_URL}/tokens?page=1&limit=${limit}`
                        },
                        last: {
                            page: totalPages,
                            href: `${process.env.BASE_URL}/tokens?page=${totalPages}&limit=${limit}`
                        },
                        previous: page > 1 ? {
                            page: page - 1,
                            href: `${process.env.BASE_URL}/tokens?page=${page - 1}&limit=${limit}`
                        } : null,
                        next: page < totalPages ? {
                            page: page + 1,
                            href: `${process.env.BASE_URL}/tokens?page=${page + 1}&limit=${limit}`
                        } : null
                    }

                }

            }
        );
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// CREATE TOKEN
router.post('/', async (req, res) => {
    if (req.body.method === "SEED"){
        try{
            const amount = req.body.amount;
            const reset = req.body.reset;

            if (reset) {
                await Token.deleteMany({});
            }

            for (let i = 0; i < amount; i++) {
                await Token.create({
                    // nameToken: faker.lorem.lines(1),
                    nameToken: faker.finance.accountName(1),
                    tigger: faker.finance.currencyName ({min: 1, max: 3}),
                    adress: faker.finance.ethereumAddress()
                });
            }
            res.status(201).json({message: `Er staan nu ${amount} tokens in de database. en de database is ${reset ? '' : 'niet'}gereset`});
            // Status 200 als update succesvol is
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }else{

        try {
            const {nameToken, tigger, adress} = req.body;

            const token = await Token.create({
                nameToken: nameToken,
                tigger: tigger,
                adress: adress,
            });
            res.status(201).json(token);

        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }
});


// GET TOKEN BY ID
router.get('/:id', async (req, res) => {
    try {
        const tokenID = req.params.id;
        const token = await Token.findById(tokenID);

        if (!token) {
            return res.status(404).json({ error: 'Token not found' });
        }
        res.status(200).send(token); // Status 200 als update succesvol is

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

//EDIT TOKEN
router.put('/:id', async (req, res) => {
    try {
        const { nameToken, tigger, adress } = req.body;
        const token = await Token.findByIdAndUpdate( //
            req.params.id,
            { nameToken, tigger, adress},
            { new: true, runValidators: true } // Return de geüpdatete notitie
        );

        if (!token) {
            return res.status(404).json({ error: 'Token not found' });
        }

        res.status(201).json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE TOKEN (BY ID)
router.delete('/:id', async (req, res) => {
    try {
        const token = await Token.findByIdAndDelete(req.params.id); // Zoek en verwijder de notitie

        if (!token) {
            return res.status(404).json({ error: 'Token not found' });
        }

        // res.status(201).json({ message: 'Token deleted successfully' });
        res.status(204).json({ message: 'Token deleted successfully' }); // Status 200 als update succesvol is
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// FAVOURITE TOKEN (PATCH)
router.patch('/:id', async (req, res) => {
    try {
        const tokenID = req.params.id;
        const { favorite } = req.body;

        // Controleer of 'favorite' een boolean is
        if (typeof favorite !== 'boolean') { // Als 'favorite' geen boolean is,
            return res.status(400).json({ error: "'favorite' field must be a boolean." }); // geef een foutmelding
        }

        const token = await Token.findByIdAndUpdate(
            tokenID,
            { favorite }, // Alleen het veld 'favorite' aanpassen
            { new: true, runValidators: true }
        );

        if (!token) {
            return res.status(404).json({ error: 'Token not found' });
        }

        res.status(200).json(token); // Teruggeven van het bijgewerkte token
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});





// MAKE SEEDER
router.post('/seed', async (req, res) => {
    try{
        const amount = req.body.amount;
        const reset = req.body.reset;

        if (reset) {
            await Token.deleteMany({});
        }

        for (let i = 0; i < amount; i++) {
            await Token.create({
                // nameToken: faker.lorem.lines(1),
                nameToken: faker.finance.accountName(1),
                tigger: faker.finance.currencyName ({min: 1, max: 3}),
                adress: faker.finance.ethereumAddress()
            });
        }
        res.status(201).json({message: `Er staan nu ${amount} tokens in de database. en de database is ${reset ? '' : 'niet'}gereset`});
        // Status 200 als update succesvol is
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router