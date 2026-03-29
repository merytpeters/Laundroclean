/**
 * @swagger
 * tags:
 *   - name: Locations
 *     description: Dropoff point and service area routes
 *
 * components:
 *   schemas:
 *     DropOffPointRequest:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           example: Main Branch
 *         address:
 *           type: string
 *           example: 12 Baker Street, Lagos
 *     DropOffPointResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         lat:
 *           type: number
 *         lng:
 *           type: number
 *         isActive:
 *           type: boolean
 *
 * /api/v1/dropoffpoint:
 *   post:
 *     tags:
 *       - Locations
 *     summary: Create a new dropoff point (company user)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DropOffPointRequest'
 *     responses:
 *       '201':
 *         description: Dropoff point created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DropOffPointResponse'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *
 *   get:
 *     tags:
 *       - Locations
 *     summary: List dropoff points
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of dropoff points
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DropOffPointResponse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       '401':
 *         description: Unauthorized
 *
 * /api/v1/dropoffpoint/{dropoffId}:
 *   get:
 *     tags:
 *       - Locations
 *     summary: Get a dropoff point by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dropoffId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Dropoff point details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DropOffPointResponse'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not found
 *
 *   patch:
 *     tags:
 *       - Locations
 *     summary: Update a dropoff point
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dropoffId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DropOffPointRequest'
 *     responses:
 *       '200':
 *         description: Updated dropoff point
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DropOffPointResponse'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not found
 *
 * /api/v1/dropoffpoint/{dropoffId}/inactive:
 *   post:
 *     tags:
 *       - Locations
 *     summary: Make a dropoff point inactive (company admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dropoffId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Dropoff point set inactive
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not found
 *
 * /api/v1/dropoffpoint/{dropoffId}/active:
 *   post:
 *     tags:
 *       - Locations
 *     summary: Reactivate a dropoff point (company user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dropoffId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Dropoff point set active
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not found
 */

export {};
