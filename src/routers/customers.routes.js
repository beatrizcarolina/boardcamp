import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js"
import { addCustomer, getCustomers, getCustomersByID, updateCustomer } from "../controllers/customers.controller.js";
import { customerSchema } from "../schemas/customers.schema.js";

const customersRouter = Router();
customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomersByID);
customersRouter.post("/customers", validateSchema(customerSchema), addCustomer);
customersRouter.put("/customers/:id", validateSchema(customerSchema), updateCustomer);

export default customersRouter;