
/**
 * @swagger
 * tags:
 *   - name: ServicePrice
 *     description: Service pricing routes for company users
 *
 * components:
 *   schemas:
 *     ServicePriceCreateRequest:
 *       type: object
 *       required:
 *         - price
 *         - currency
 *       properties:
 *         price:
 *           type: number
 *           example: 12.5
 *         currency:
 *           type: string
 *           example: USD
 *         unit:
 *           type: string
 *           example: kg
 *         notes:
 *           type: string
 *           example: Price for standard wash
 *     ServicePriceResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         serviceId:
 *           type: string
 *         price:
 *           type: number
 *         currency:
 *           type: string
 *         unit:
 *           type: string
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 * /api/v1/service-price/{serviceId}:
 *   post:
 *     tags:
 *       - ServicePrice
 *     summary: Create a price entry for a service (company users only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicePriceCreateRequest'
 *     responses:
 *       '201':
 *         description: Service price created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicePriceResponse'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden - insufficient permissions
 */

export {};
