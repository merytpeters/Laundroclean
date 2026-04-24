/**
 * @swagger
 * components:
 *   schemas:
 *     PromoCheckQuery:
 *       type: object
 *       properties:
 *         serviceId:
 *           type: string
 *           description: Service UUID to check promo against
 *         code:
 *           type: string
 *           description: Promo code string
 *         totalAmount:
 *           type: number
 *           description: Optional total amount to preview discount
 *     PromoValidationResult:
 *       type: object
 *       properties:
 *         valid:
 *           type: boolean
 *         calculation:
 *           type: object
 *           properties:
 *             discount:
 *               type: number
 *             finalAmount:
 *               type: number
 *         promo:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             code:
 *               type: string
 *             description:
 *               type: string
 *             type:
 *               type: string
 *             value:
 *               type: number
 *             startsAt:
 *               type: string
 *               format: date-time
 *             expiresAt:
 *               type: string
 *               format: date-time
 *
 * /api/v1/promocode/validate:
 *   get:
 *     tags:
 *       - Promo
 *     summary: Validate/preview a promo code for a service (public)
 *     parameters:
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Service UUID
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Promo code
 *       - in: query
 *         name: totalAmount
 *         schema:
 *           type: number
 *         required: false
 *         description: Optional total to calculate discount preview
 *     responses:
 *       '200':
 *         description: Promo validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PromoValidationResult'
 *       '400':
 *         description: Missing parameters or validation error
 *       '404':
 *         description: Promo not found or not valid for service
 */

export {};
