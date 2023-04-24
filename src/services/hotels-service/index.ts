import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import { Hotel } from "@prisma/client";

async function getAllHotel(): Promise<Hotel[]> {
    const hotels: Hotel[] = await hotelsRepository.findHotels();
    if (!hotels) throw notFoundError();
  
    return hotels;
}

const hotelService = {
    getAllHotel
}

export default hotelService;