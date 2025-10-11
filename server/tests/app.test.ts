import request from 'supertest';
import app from '../src/app.js';
import 'dotenv/config';

describe('GET /', () => {
    it('should return a running message', async ()=> {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('LaundroClean is running');
    });
});

describe('GET /health', () => {
    it('should return health status', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.uptime).toBe('number');
        expect(typeof res.body.timestamp).toBe('string');
    });
});