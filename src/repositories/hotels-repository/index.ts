import { Hotel } from "@prisma/client";
import { prisma } from '@/config';


async function findHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

export default {
    findHotels
}