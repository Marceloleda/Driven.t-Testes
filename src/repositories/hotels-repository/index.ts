import { Hotel } from "@prisma/client";
import { prisma } from '@/config';
import { notFoundError } from "@/errors";


async function findHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

async function findHotelById(id: number): Promise<Hotel> {

    const hotelWithRooms = await prisma.hotel.findFirst({
        where: {id: id},
        include: {
            Rooms: true,
        }
    });

    if(!hotelWithRooms) throw notFoundError();

    return hotelWithRooms;


}

const hotelsRepository = {
    findHotels,
    findHotelById
}
export default hotelsRepository;