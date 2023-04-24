import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Room } from '@prisma/client';

export async function createHotels() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.cats(),
    },
  });
}


  