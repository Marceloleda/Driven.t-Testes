import hotelService from "@/services/hotels-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

async function getAllHotels(req:Request, res: Response): Promise<Response> {
    try{
        const hotels = await hotelService.getAllHotel();
        res.status(httpStatus.OK).send(hotels)
    }catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send(error);
      }
}

export default {
    getAllHotels
}