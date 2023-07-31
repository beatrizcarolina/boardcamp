import { db } from "../database/database.js"

export async function getGames(req,res) {
    let query = `SELECT * FROM games`;
    const queryParams = [];

    try {
        const games = await db.query(query, queryParams);
        return res.send(games.rows);        
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export async function addGames(req,res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const foundGame = await db.query(`SELECT "name" FROM games WHERE "name"=$1`, [name]);
        if (foundGame.rowCount !== 0) {
            return res.sendStatus(409);
        }

        await db.query(`INSERT INTO games ("name", "image", "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [
            name,
            image,
            stockTotal,
            pricePerDay,
        ]);
        return res.sendStatus(201);        
    } catch (error) {
        return res.status(500).send(error.message);
    }
};