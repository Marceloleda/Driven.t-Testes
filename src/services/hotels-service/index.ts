import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import { Hotel } from "@prisma/client";

async function getAllHotel(): Promise<Hotel[]> {
    const hotels: Hotel[] = await hotelsRepository.findHotels();
    if (!hotels) throw notFoundError();
  
    return hotels;
}
async function getHotelById(id: number): Promise<Hotel> {
    console.log(id);
    const hotel: Hotel = await hotelsRepository.findHotelById(id);
    if (!hotel) throw notFoundError();
  
    return hotel;
  }

const hotelService = {
    getAllHotel,
    getHotelById
}

export default hotelService;