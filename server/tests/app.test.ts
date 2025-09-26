import request from 'supertest';
import app from '../src/app.js';

describe("GET /", () => {
    it("should return a running message", async ()=> {
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("LaundroClean is running");
    });
});