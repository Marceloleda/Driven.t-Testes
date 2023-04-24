import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

async function getAllHotels(req:AuthenticatedRequest, res: Response): Promise<Response> {
  const userId: number = req.userId
    try{
        const hotels = await hotelService.getAllHotel();
        const enrollmentValid = await hotelService.validEnrollment(userId)
        if(hotels.length === 0 || enrollmentValid){
          return res.send(httpStatus.NOT_FOUND)
        }
        res.status(httpStatus.OK).send(hotels)
    }catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
      }
}

async function getHotelsById(req: Request, res: Response, next: NextFunction) {
    const hotelId: string = req.params.hotelId;
    const idNumber: number = parseInt(hotelId, 10);
    try {
      if (isNaN(idNumber)) {
        console.log('Must be an Id valid');
        
        return res.sendStatus(httpStatus.BAD_REQUEST);
      }
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