import { db } from "../database/database.js";

export async function getCustomers(req,res) {
    let query = `SELECT * FROM customers`;
    const queryParams = [];

    try {
        const customers = await db.query(query, queryParams);
        customers.rows.forEach((customer) => {
            customer.birthday = dayjs(customer.birthday).format("YYYY-MM-DD");
        });
        return res.send(customers.rows);     
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

export async function getCustomersByID(req, res) {
    const id = req.params.id;

    try {
        const foundCustomer = await db.query(`SELECT * FROM customers WHERE "id"=$1`, [id]);
        if (foundCustomer.rowCount === 0) {
            return res.sendStatus(404);
        }

        foundCustomer.rows[0].birthday = dayjs(foundCustomer.rows[0].birthday).format("YYYY-MM-DD");
        return res.send(foundCustomer.rows[0]);        
    } catch (error) {
        return res.status(500).send(error.message);
    }

};

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