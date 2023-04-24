import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import hotelsController from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', hotelsController.getAllHotels)
  .get('/:hotelId', hotelsController.getAllHotels)

  export {hotelsRouter}