import { notFoundError } from "@/errors";
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

async function getHotelsById(req: Request, _req:AuthenticatedRequest, res: Response, next: NextFunction) {
  const hotelId: string = req.params.hotelId;
  const idNumber: number = parseInt(hotelId, 10);
  const userId: number = _req.userId
  try {
    if (isNaN(idNumber)) {
      console.log('Must be a valid Id');
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const hotelById = await hotelService.findHotelById(idNumber);
    if (!hotelById) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    const enrollment = await hotelService.findEnrollment(userId);
    if (!enrollment) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    const ticket = await hotelService.findFirstTicketWithTicketType(enrollment.id);
    if (!ticket || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    res.status(httpStatus.OK).send(hotelById);
  } catch (error) {
    next(error);
  }
}


export default {
    getAllHotels,
    getHotelsById
}