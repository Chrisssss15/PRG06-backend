import express from "express";
import {faker} from "@faker-js/faker";
import Token from "../models/token.js";

const router = express.Router();



// OPTIONS (overview)
router.options("/", (req, res) => {
    res.header("Allow", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.send();
});

// GET ALL TOKENS
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100; // Default limit is 10
        const page = parseInt(req.query.page) || 1;    // Default page is 1
        const skip = (page - 1) * limit; // Skip the first {skip} items

        const totalItems = await Token.countDocuments(); // Totale aantal items
        const tokens = await Token.find({}).skip(skip).limit(limit);

        const totalPages = Math.ceil(totalItems / limit);


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
                    nameToken: faker.finance.accountName(1),
                    tigger: faker.finance.currencyCode({min: 1, max: 3}),
                    adres: faker.finance.ethereumAddress(),
                    imgURL: faker.image.avatarLegacy()
                });
            }
            res.status(201).json({message: `Er staan nu ${amount} tokens in de database. en de database is ${reset ? '' : 'niet'}gereset`});
            // Status 200 als update succesvol is
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }else{
        try {
            const {nameToken, tigger, adres, imgURL} = req.body;

            const token = await Token.create({
                nameToken: nameToken,
                tigger: tigger,
                adres: adres,
                imgURL: imgURL
            });
            res.status(201).json(token);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }


});

//DELETE ALL


// OPTIONS (detail)
router.options("/:id", (req, res) => {
    res.header("Allow", "GET, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
    res.status(204).send();
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
        const { nameToken, tigger, adres, imgURL } = req.body;
        const token = await Token.findByIdAndUpdate(
            req.params.id,
            { nameToken, tigger, adres, imgURL },
            { new: true, runValidators: true } // Return de geüpdatete notitie
        );

        if (!token) {
            return res.status(404).json({ error: 'Token not found' });
        }

        res.status(201).json(token); // Status 200 als update succesvol is
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE TOKEN (BY ID)
router.delete('/:id', async (req, res) => {
    try {
        const token = await Token.findByIdAndDelete(req.params.id); //

        if (!token) {
            return res.status(404).json({ error: 'Token not found' });
        }

        // res.json({ message: 'Token deleted successfully' });
        res.status(204).json({ message: 'Token deleted successfully' }); // Status 200 als update succesvol is
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});





export default router