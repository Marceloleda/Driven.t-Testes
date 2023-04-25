import { authenticateToken } from "@/middlewares";
import { Router } from "express";
import { getAllHotels, getHotelsWithRooms } from "@/controllers/hotels-controller";

const hotelsRouter = Router();

hotelsRouter
  .all('/*', authenticateToken)
  .get('/', getAllHotels)
  .get('/:hotelId', getHotelsWithRooms)

  export {hotelsRouter}