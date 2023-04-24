import { Hotel, Ticket, Enrollment } from '@prisma/client';
import httpStatus from 'http-status';
import { notFoundError } from '@/errors';
import hotelsRepository from '@/repositories/hotels-repository';
import { prisma } from '@/config';

async function getAllHotel(): Promise<Hotel[]> {
    const hotels: Hotel[] = await hotelsRepository.findHotels();
    if (!hotels) throw notFoundError();

    return hotels;
}


interface TicketsWithTicketType extends Ticket {
  TicketType: {
    isRemote: boolean;
    includesHotel: boolean;
  };
}

async function findHotels(): Promise<Hotel[]> {
  const hotels: Hotel[] = await prisma.hotel.findMany();
  if (!hotels) throw notFoundError();

  return hotels;
}

async function findHotelById(id: number): Promise<Hotel> {
  const hotel: Hotel = await prisma.hotel.findUnique({
    where: { id },
  });
  if (!hotel) throw notFoundError();

  return hotel;
}

async function findEnrollment(userId: number): Promise<Enrollment> {
  const enrollment: Enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId,
    },
  });
  if (!enrollment) throw notFoundError();

  return enrollment;
}

async function findFirstTicketWithTicketType(
  enrollmentId: number
): Promise<TicketsWithTicketType> {
  const ticket: TicketsWithTicketType = await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });

  return ticket;
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
    validEnrollment,
    findHotels,
    findHotelById,
    findEnrollment,
    findFirstTicketWithTicketType,
}

export default hotelService;