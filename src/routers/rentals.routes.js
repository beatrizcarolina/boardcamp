import { Router } from "express";
import { addRental } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js"
import { rentalSchema } from "../schemas/rentals.schema.js";

const rentalsRouter = Router();
rentalsRouter.post("/rentals", validateSchema(rentalSchema), addRental);
export default rentalsRouter;