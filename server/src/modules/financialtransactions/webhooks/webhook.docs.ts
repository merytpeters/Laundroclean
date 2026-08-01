/**
 * @swagger
 * components:
 *   schemas:
 *     OpayWebhookRequest:
 *       type: object
 *       required:
 *         - reference
 *         - status
 *       properties:
 *         reference:
 *           type: string
 *           example: "OPAY-REF-1234567890"
 *         status:
 *           type: string
 *           enum: [INITIAL, PENDING, SUCCESS, FAIL, CLOSE]
 *           example: SUCCESS
 *         payMethod:
 *           type: string
 *           example: "BANKCARD"
 *         paidAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-01T10:00:00.000Z"
 *         signature:
 *           type: string
 *           description: Optional signature value included by the provider payload
 *         additionalData:
 *           type: object
 *           additionalProperties: true
 *           description: Provider-specific webhook payload fields not explicitly modeled here
 *
 *     WebhookSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Invalid webhook signature.
 *
 * tags:
 *   - name: Webhook
 *     description: Payment provider webhook callbacks
 *
 * paths:
 *   /api/webhooks/opay:
 *     post:
 *       tags:
 *         - Webhook
 *       summary: Receive an OPay payment webhook
 *       description: Verifies the `x-opay-signature` header, parses the incoming payload, and updates the related payment.
 *       parameters:
 *         - in: header
 *           name: x-opay-signature
 *           required: true
 *           schema:
 *             type: string
 *           description: HMAC signature for the raw JSON payload
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpayWebhookRequest'
 *       responses:
 *         '200':
 *           description: Webhook processed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/WebhookSuccessResponse'
 *         '401':
 *           description: Invalid webhook signature
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '500':
 *           description: Webhook processing failed
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */

export {};
