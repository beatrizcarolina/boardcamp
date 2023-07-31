import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function addRental(req,res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE "id"=$1`, [customerId]);
        if (customer.rowCount === 0) {
            return res.sendStatus(400);
        }

        const game = await db.query(`SELECT * FROM games WHERE "id"=$1`, [gameId]);
        if (game.rowCount === 0) {
            return res.sendStatus(400);
        }

        const rentedGame = await db.query(`SELECT "id" FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`, [
            gameId,
        ]);
        if (rentedGame.rowCount >= game.rows[0].stockTotal || game.rows[0].stockTotal === 0) {
            return res.sendStatus(400);
        }

        await db.query(`UPDATE games SET "stockTotal"="stockTotal"-1 WHERE "id"=$1`, [gameId]);

        await db.query(
            `INSERT INTO rentals 
            ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, null, null)`,
            [customerId, gameId, daysRented, dayjs().format("YYYY-MM-DD"), game.rows[0].pricePerDay * daysRented]
        );

        return res.sendStatus(201);        
    } catch (error) {
        return res.status(500).send(error.message);
    }
};