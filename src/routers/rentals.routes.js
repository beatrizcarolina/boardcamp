import { Router } from "express";
import { addRental, finishRental, getRental } from "../controllers/rentals.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js"
import { rentalSchema } from "../schemas/rentals.schema.js";

const rentalsRouter = Router();
rentalsRouter.get("/rentals", getRental);
rentalsRouter.post("/rentals", validateSchema(rentalSchema), addRental);
rentalsRouter.post("/rentals/:id/return", finishRental);
export default rentalsRouter;