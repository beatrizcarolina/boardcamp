import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js"
import { addCustomer, getCustomers, getCustomersByID } from "../controllers/customers.controller.js";
import { customerSchema } from "../schemas/customers.schema.js";

const customersRouter = Router();
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersByID);
customersRouter.post("/customers", validateSchema(customerSchema), addCustomer);

export default customersRouter;