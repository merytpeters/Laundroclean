
/**
 * @swagger
 * tags:
 *   - name: ClientUser
 *     description: Client user routes
 *
 * components:
 *   schemas:
 *     ServiceResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         isActive:
 *           type: boolean
 *     ServiceListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ServiceResponse'
 *
 * /api/v1/client/services:
 *   get:
 *     tags:
 *       - ClientUser
 *     summary: Get list of active services available to clients
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
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of active services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ServiceListResponse'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       '401':
 *         description: Unauthorized
 *
 * /api/v1/client/services/{id}:
 *   get:
 *     tags:
 *       - ClientUser
 *     summary: Get an active service by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not found
 */

/**
 * @swagger
 * /api/v1/client/booking:
 *   post:
 *     tags:
 *       - ClientUser
 *     summary: Create a booking (client)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       '201':
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *
 * /api/v1/client/bookings:
 *   get:
 *     tags:
 *       - ClientUser
 *     summary: Get list of bookings for the logged-in client
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
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingListResponse'
 *       '401':
 *         description: Unauthorized
 *
 * /api/v1/client/bookings/{bookingId}:
 *   get:
 *     tags:
 *       - ClientUser
 *     summary: Get booking details (client must own booking)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Not found
 *
 *   patch:
 *     tags:
 *       - ClientUser
 *     summary: Update a booking (client)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookingRequest'
 *     responses:
 *       '200':
 *         description: Updated booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 *
 *   delete:
 *     tags:
 *       - ClientUser
 *     summary: Cancel (delete) a booking (client - subject to allowed statuses)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Booking cancelled (no content)
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 * 
 * /api/v1/client/bookings-status/{bookingId}:
 *   patch:
 *     tags:
 *       - ClientUser
 *     summary: Update booking status (client - subject to rules)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingStatusRequest'
 *     responses:
 *       '200':
 *         description: Updated booking
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */

export {};
