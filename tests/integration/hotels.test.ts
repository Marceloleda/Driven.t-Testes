import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import { createHotels, createUser } from '../factories';
import * as jwt from 'jsonwebtoken';
import { prisma } from '@/config';


beforeAll(async () => {
    await init();
  });
  
  beforeEach(async () => {
    await cleanDb();
  });
  
  const server = supertest(app);

  describe('GET /hotels', ()=>{
    it('should respond with status 401 if no token is given', async ()=>{
      const response = await server.get('/hotels');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {


      it('should respond with 404 when there are no hotels created', async () => {
        const token = await generateValidToken();
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      // it('should respond with 404 when there are no enrollment ', async () => {
      //   const token = await generateValidToken();
  
      //   const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        
  
      //   expect(response.status).toBe(httpStatus.NOT_FOUND);
      // });
  
  
      it('should respond with status 200 and with existing hotels data', async () => {
        const token = await generateValidToken();
  
        const hotels = await createHotels();
  
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual([
          {
            id: hotels.id,
            name: hotels.name,
            image: hotels.image,
            createdAt: hotels.createdAt.toISOString(),
            updatedAt: hotels.updatedAt.toISOString(),
          },
        ]);
      });
    });
  })

  describe('GET /hotels/:hotelId', ()=>{
    it('should respond with status 401 if no token is given', async ()=>{
      const response = await server.get(`/hotels/${faker.random.numeric()}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED)
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get(`/hotels/hotels/${faker.random.numeric()}`).set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels/:hotelId').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
      it('should respond with empty array when there are no hotels created', async () => {
        const token = await generateValidToken();
    
        const response = await server.get(`/hotels/${faker.random.numeric()}`).set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
    
      it('should respond with status 200 and with existing hotelWithRooms data', async () => {
        const token = await generateValidToken();
    
        const hotel = await prisma.hotel.create({
          data: {
            name: faker.company.companyName(),
            image: faker.image.cats(),
          },
        });
    
        const room = await prisma.room.create({
          data: {
            name: faker.name.findName(),
            capacity: faker.datatype.number(),
            hotelId: hotel.id,
          },
        });
    
        const hotelWithRooms = await prisma.hotel.findUnique({
          where: { id: hotel.id },
          include: { Rooms: true },
        });
    
        const response = await server.get(`/hotels/${hotelWithRooms.id}`).set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: hotelWithRooms.id,
          name: hotelWithRooms.name,
          image: hotelWithRooms.image,
          createdAt: hotelWithRooms.createdAt.toISOString(),
          updatedAt: hotelWithRooms.updatedAt.toISOString(),
          Rooms: [
            {
              id: hotelWithRooms.Rooms[0].id,
              name: hotelWithRooms.Rooms[0].name,
              capacity: hotelWithRooms.Rooms[0].capacity,
              hotelId: hotelWithRooms.Rooms[0].hotelId,
              createdAt: hotelWithRooms.Rooms[0].createdAt.toISOString(),
              updatedAt: hotelWithRooms.Rooms[0].updatedAt.toISOString(),
            }
          ]
        });
      });
    });
    
    
  })