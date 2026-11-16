
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from './orphanageTestApp.js';
import orphanageModel from '../models/orphanageModel.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
}, 60000);

afterEach(async () => {
    await orphanageModel.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();

    if (mongoServer) {
        await mongoServer.stop();
    }
});

describe("Testing the Orphanage Creation API", () => {

    test("Testing With Correct Data", async () => {

        const response = await request(app)
            .post('/orphanages/createorphanage')
            .send({
                cciRegistrationnumber: 'CCI12345',
                location: 'Madurai',
                districtCode: 625001,
                institutionCode: 'INS101',
                institutionType: 'Government',
                managingAuthority: 'Government Authority',
                password: 'Orphanage@123'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Signup Successfull');

        const savedOrphanage = await orphanageModel.findOne({
            cciRegistrationnumber: 'CCI12345'
        });

        expect(savedOrphanage).not.toBeNull();
        expect(savedOrphanage.cciRegistrationnumber).toBe('CCI12345');
        expect(savedOrphanage.password).not.toBe('Orphanage@123');

    });

    test("Testing With Missing Required Data", async () => {

        const response = await request(app)
            .post('/orphanages/createorphanage')
            .send({
                location: 'Madurai',
                districtCode: 625001,
                institutionCode: 'INS101',
                institutionType: 'Government',
                managingAuthority: 'Government Authority',
                password: 'Orphanage@123'
            });

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toBe('Server Failed');

        const savedOrphanage = await orphanageModel.findOne({
            location: 'Madurai'
        });

        expect(savedOrphanage).toBeNull();

    });

});
