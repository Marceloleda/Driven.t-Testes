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

async function validEnrollment(userId: number) {
    const validEnrollment = await hotelsRepository.findEnrollment(userId);
  
    return validEnrollment;
}


const hotelService = {
    getAllHotel,
    getHotelById,
    validEnrollment
}

export default hotelService;