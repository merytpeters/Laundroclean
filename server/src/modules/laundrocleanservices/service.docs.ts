/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cln_01H8Y2Z1A9B0C"
 *         name:
 *           type: string
 *           example: "Wash & Fold"
 *         description:
 *           type: string
 *           example: "Standard wash and dry, folded"
 *         price:
 *           type: number
 *           format: float
 *           example: 5.5
 *         durationMinutes:
 *           type: integer
 *           example: 120
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ServiceListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Service'
 *         total:
 *           type: integer
 *           example: 42
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 * tags:
 *   - name: Services
 *     description: Public service listing and details
 *
 * paths:
 *   /api/v1/services:
 *     get:
 *       tags:
 *         - Services
 *       summary: Get list of active services
 *       description: Returns a paginated list of active laundroclean services. Supports simple search and pagination.
 *       parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           description: Text to search service name or description
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             default: 1
 *           description: Page number
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             default: 10
 *           description: Items per page
 *         - in: query
 *           name: sort
 *           schema:
 *             type: string
 *           description: Sort order, e.g. "price:asc" or "name:desc"
 *       responses:
 *         '200':
 *           description: A paginated list of services
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ServiceListResponse'
 *         '400':
 *           description: Invalid request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /api/v1/services/{id}:
 *     get:
 *       tags:
 *         - Services
 *       summary: Get details for a single active service
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Service unique identifier
 *       responses:
 *         '200':
 *           description: Service details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Service'
 *         '404':
 *           description: Service not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '400':
 *           description: Invalid ID supplied
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */

export {};
