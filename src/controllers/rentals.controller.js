import { db } from "../database/database.js";
import dayjs from "dayjs";

export async function getRental(req,res) {
    let query = `
    SELECT rentals.*, 
    customers.name AS "customerName", 
    games.name AS "gameName" 
    FROM rentals 
    INNER JOIN customers ON rentals."customerId" = customers.id 
    INNER JOIN games ON rentals."gameId" = games.id
    `;
    const queryParams = [];

    try {
        const rentals = await db.query(query, queryParams);

        const formattedRentals = rentals.rows.map((rental) => {
            const formattedRental = {
                ...rental,
                returnDate: rental.returnDate ? dayjs(rental.returnDate).format("YYYY-MM-DD") : null,
                rentDate: dayjs(rental.rentDate).format("YYYY-MM-DD"),
                customer: {
                    id: rental.customerId,
                    name: rental.customerName,
                },
                game: {
                    id: rental.gameId,
                    name: rental.gameName,
                },
            };
            delete formattedRental.gameName;
            delete formattedRental.customerName;
            return formattedRental;
        });

        return res.send(formattedRentals);
        
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export async function addRental(req,res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE "id"=$1`, [customerId]);
        if (customer.rowCount === 0) {
            return res.sendStatus(400);
        };

        const game = await db.query(`SELECT * FROM games WHERE "id"=$1`, [gameId]);
        if (game.rowCount === 0) {
            return res.sendStatus(400);
        };

        const rentedGame = await db.query(`SELECT "id" FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`, [
            gameId,
        ]);
        if (rentedGame.rowCount >= game.rows[0].stockTotal || game.rows[0].stockTotal === 0) {
            return res.sendStatus(400);
        };

        await db.query(`UPDATE games SET "stockTotal"="stockTotal"-1 WHERE "id"=$1`, [gameId]);

        await db.query(
            `INSERT INTO rentals 
            ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, null, null)`,
            [customerId, gameId, daysRented, dayjs().format("YYYY-MM-DD"), game.rows[0].dayPrice*daysRented]
        );

        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export async function finishRental(req,res) {
    const id = req.params.id;

    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE "id"=$1;`, [id]);
        if (rental.rowCount === 0) {
            return res.sendStatus(404);
        };

        if (rental.rows[0].returnDate !== null) {
            return res.sendStatus(400);
        };

        const { rentDate, daysRented, originalPrice } = rental.rows[0];
        const pastDays = dayjs().diff(dayjs(rentDate), "days");
        const dayPrice = originalPrice / daysRented;
        const delayFee = pastDays > daysRented ? dayPrice * (pastDays - daysRented) : null;

        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE "id"=$3;`, [
            dayjs().format("YYYY-MM-DD"),
            delayFee,
            id,
        ]);

        return res.sendStatus(200);
        
    } catch (error) {
        return res.status(500).send(error.message);
    }
};