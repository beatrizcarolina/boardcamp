import { db } from "../database/database.js";

export async function addCustomer(req,res) {
    const { name, phone, birthday, cpf } = req.body;

    try {
        const foundCustomer = await db.query(`SELECT "cpf" FROM customers WHERE "cpf"=$1`, [cpf]);
        if (foundCustomer.rowCount !== 0) {
            return res.sendStatus(409);
        }

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [
            name,
            phone,
            cpf,
            birthday,
        ]);
        return res.sendStatus(201);        
    } catch (error) {
        return res.status(500).send(error.message);
    }

};