import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import { Hotel } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from '@/config';


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
    const enrollment = await hotelsRepository.findEnrollment(userId);
  
    if (!enrollment) {
      return {
        status: httpStatus.PAYMENT_REQUIRED,
        message: 'Enrollment not found',
      };
    }
    
    const ticket = await prisma.ticket.findFirst({
      where: {
        enrollmentId: enrollment.id,
      },
      include: {
        TicketType: true,
      },
    });
  
    if (
      !ticket ||
      ticket.TicketType.isRemote ||
      !ticket.TicketType.includesHotel 
    ) {
      return {
        status: httpStatus.PAYMENT_REQUIRED,
        message: 'Ticket not paid, is remote or does not include hotel',
      };
    }
  
    return enrollment;
  }



const hotelService = {
    getAllHotel,
    getHotelById,
    validEnrollment
}

export default hotelService;