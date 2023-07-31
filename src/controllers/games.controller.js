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