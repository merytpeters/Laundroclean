/**
 * @swagger
 * components:
 *   schemas:
 *     PosDevice:
 *       type: object
 *       required:
 *         - serialNumber
 *       properties:
 *         id:
 *           type: string
 *           example: "dln_08HZ245789ABC"
 *         serialNumber:
 *           type: string
 *           example: "T2m239847561"
 *         name:
 *           type: string
 *           example: "Main POS"
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     PosDeviceRequest:
 *       type: object
 *       required:
 *         - serialNumber
 *       properties:
 *         name:
 *           type: string
 *           example: "Main POS"
 *         serialNumber:
 *           type: string
 *           example: "T2m239847561"
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     PosDeviceListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PosDevice'
 *         total:
 *           type: integer
 *           example: 42
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 * tags:
 *   - name: PosDevice
 *     description: POS devices used by the company
 *
 * paths:
 *   /api/v1/posdevices:
 *     get:
 *       tags:
 *         - PosDevice
 *       summary: Get list of POS devices
 *       description: Returns a paginated list of POS devices
 *       parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *         - in: query
 *           name: isActive
 *           schema:
 *             type: boolean
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
 *       responses:
 *         '200':
 *           description: A paginated list of POS devices
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PosDeviceListResponse'
 *         '400':
 *           description: Invalid request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *     post:
 *       tags:
 *         - PosDevice
 *       summary: Create a new POS device
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PosDeviceRequest'
 *       responses:
 *         '201':
 *           description: POS device created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PosDevice'
 *         '409':
 *           description: Conflict
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *     patch:
 *       tags:
 *         - PosDevice
 *       summary: Update a POS device
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: posDeviceId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PosDeviceRequest'
 *       responses:
 *         '200':
 *           description: POS device updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PosDevice'
 *         '404':
 *           description: POS device not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /api/v1/posdevices/restore:
 *     patch:
 *       tags:
 *         - PosDevice
 *       summary: Restore a deleted POS device
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PosDeviceRequest'
 *       responses:
 *         '200':
 *           description: POS device restored successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PosDevice'
 *         '404':
 *           description: POS device not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /api/v1/posdevices/{posDeviceId}:
 *     get:
 *       tags:
 *         - PosDevice
 *       summary: Get a single POS device
 *       parameters:
 *         - in: path
 *           name: posDeviceId
 *           required: true
 *           schema:
 *             type: string
 *           description: Could be POS device unique identifier or the serial number
 *       responses:
 *         '200':
 *           description: POS device details
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PosDevice'
 *         '404':
 *           description: POS device not found
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
 *
 *
 *     patch:
 *       tags:
 *         - PosDevice
 *       summary: Soft delete a POS device
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: posDeviceId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: POS device deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PosDevice'
 *         '404':
 *           description: POS device not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '400':
 *           description: Bad Request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */