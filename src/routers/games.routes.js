import { Router } from "express";
import { addGames, getGames } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { gameSchema } from "../schemas/games.schema.js";

const gamesRouter = Router();
gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(gameSchema), addGames);

export default gamesRouter;