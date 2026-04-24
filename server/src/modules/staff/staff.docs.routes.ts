/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           example: Wash & Fold
 *         description:
 *           type: string
 *           example: Standard wash and fold service
 *         isActive:
 *           type: boolean
 *           example: true
 *         maxDailyBookings:
 *           type: integer
 *           description: Maximum number of bookings allowed per service per day (optional)
 *           example: 1
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
 *         maxDailyBookings:
 *           type: integer
 *           description: Maximum number of bookings allowed per service per day
 *     ServiceListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/ServiceResponse'
 *
 * tags:
 *   - name: Staff
 *     description: Staff (company user) routes for services
 *
 * /api/v1/staff/services:
 *   post:
 *     tags:
 *       - Staff
 *     summary: Create a new service (company user)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRequest'
 *     responses:
 *       '201':
 *         description: Service created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   get:
 *     tags:
 *       - Staff
 *     summary: Get list of active services
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/staff/services/{serviceId}:
 *   get:
 *     tags:
 *       - Staff
 *     summary: Get an active service by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   patch:
 *     tags:
 *       - Staff
 *     summary: Update a service
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
 *             $ref: '#/components/schemas/ServiceRequest'
 *     responses:
 *       '200':
 *         description: Updated service
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServiceResponse'
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/staff/booking:
 *   post:
 *     tags:
 *       - Staff
 *     summary: Create a booking (staff/company user)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/staff/bookings:
 *   get:
 *     tags:
 *       - Staff
 *     summary: Get list of bookings for company staff
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
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/staff/bookings/{bookingId}:
 *   patch:
 *     tags:
 *       - Staff
 *     summary: Update a booking (staff/company user)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   get:
 *     tags:
 *       - Staff
 *     summary: Get booking details
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
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/staff/bookings-status/{bookingId}:
 *   patch:
 *     tags:
 *       - Staff
 *     summary: Update booking status (staff permission required)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/staff/staff-calendars:
 *   post:
 *     tags:
 *       - Staff
 *     summary: Create a staff calendar (staff/company user)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffCalendarRequest'
 *     responses:
 *       '201':
 *         description: Staff calendar created
 *       '400':
 *         description: Validation error
 *       '403':
 *         description: Forbidden
 *   get:
 *     tags:
 *       - Staff
 *     summary: List staff calendars (staff/company user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       '200':
 *         description: List of staff calendars
 *
 * /api/v1/staff/staff-calendars/{calendarId}:
 *   get:
 *     tags:
 *       - Staff
 *     summary: Get a staff calendar by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Staff calendar
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 *   patch:
 *     tags:
 *       - Staff
 *     summary: Update a staff calendar (staff/company user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StaffCalendarRequest'
 *     responses:
 *       '200':
 *         description: Updated staff calendar
 *       '403':
 *         description: Forbidden
 *
 * /api/v1/staff/timeslots:
 *   post:
 *     tags:
 *       - Staff
 *     summary: Create a timeslot (staff/company user)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeSlotRequest'
 *     responses:
 *       '201':
 *         description: Time slot created
 *       '400':
 *         description: Validation error
 *       '403':
 *         description: Forbidden
 *   get:
 *     tags:
 *       - Staff
 *     summary: List timeslots (staff/company user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: staffCalendarId
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of timeslots
 *
 * /api/v1/staff/timeslots/{timeslotId}:
 *   get:
 *     tags:
 *       - Staff
 *     summary: Get a timeslot by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timeslotId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Time slot
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 *   patch:
 *     tags:
 *       - Staff
 *     summary: Update a timeslot (staff/company user)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timeslotId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeSlotRequest'
 *     responses:
 *       '200':
 *         description: Updated timeslot
 *       '403':
 *         description: Forbidden
 */

export {};