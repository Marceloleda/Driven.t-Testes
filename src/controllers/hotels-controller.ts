import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

async function getAllHotels(req:Request, res: Response): Promise<Response> {
    try{
        const hotels = await hotelService.getAllHotel();
        res.status(httpStatus.OK).send(hotels)
    }catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
      }
}

async function getHotelsById(req: Request, res: Response, next: NextFunction) {
    const hotelId: string = req.params.hotelId;
    const idNumber: number = parseInt(hotelId, 10);
    try {
      const hotelById = await hotelService.getHotelById(idNumber);
      res.status(httpStatus.OK).send(hotelById);
    } catch (error) {
      next(error);
    }
  }

export default {
    getAllHotels,
    getHotelsById
}