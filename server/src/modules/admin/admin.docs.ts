
/**
 * @swagger
 * components:
 *   schemas:
 *     CompanySignupRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - companyId
 *       properties:
 *         name:
 *           type: string
 *           example: Acme staff
 *         email:
 *           type: string
 *           format: email
 *           example: staff@acme.example
 *         password:
 *           type: string
 *           format: password
 *           example: StrongPass!23
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         accessToken:
 *           type: string
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         isActive:
 *           type: boolean
 *         type:
 *           type: string
 *           description: user type (CLIENT or COMPANYUSER)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UsersListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/UserProfileResponse'
 *     SetActiveRequest:
 *       type: object
 *       required:
 *         - isActive
 *       properties:
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     BookingSettingsRequest:
 *       type: object
 *       required:
 *         - minPickupDays
 *       properties:
 *         minPickupDays:
 *           type: integer
 *           example: 2
 *     BookingSettingsResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         minPickupDays:
 *           type: integer
 *           example: 2

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
 *     CompanyRoleRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: Manager
 *         level:
 *           type: integer
 *           example: 2
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["read:bookings", "manage:staff"]
 *     CompanyUsersRoleResponse:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               profile:
 *                 type: object
 *                 properties:
 *                   phoneNumber:
 *                     type: string
 *         id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         title:
 *           type: string
 *         level:
 *           type: integer
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *     CompanyRoleResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         title:
 *           type: string
 *         level:
 *            type: integer
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CompanyRoleListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/CompanyRoleResponse'

 * tags:
 *   - name: Admin
 *     description: Admin-only routes
 *
 * /api/v1/admin/company-user/register:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Register a company user (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanySignupRequest'
 *     responses:
 *       '201':
 *         description: Company user registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
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
 *
 *
 *
 * /api/v1/admin/company-roles:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new company role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyRoleRequest'
 *     responses:
 *       '201':
 *         description: Role created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyRoleResponse'
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
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get list of company roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyRoleListResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/admin/company-roles/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a single company role by id
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
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyUsersRoleResponse'
 *       '401':
 *         description: Unauthorized
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
 *       - Admin
 *     summary: Update a company role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompanyRoleRequest'
 *     responses:
 *       '200':
 *         description: Updated role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyRoleResponse'
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
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a company role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Role deleted (no content)
 *       '401':
 *         description: Unauthorized
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

 *   UserProfileResponse:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         example: 123e4567-e89b-12d3-a456-426614174000
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *         format: email
 *       isActive:
 *         type: boolean
 *       type:
 *         type: string
 *         description: user type (CLIENT or COMPANYUSER)
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 *   UsersListResponse:
 *     type: array
 *     items:
 *       $ref: '#/components/schemas/UserProfileResponse'
 *   SetActiveRequest:
 *     type: object
 *     required:
 *       - isActive
 *     properties:
 *       isActive:
 *         type: boolean
 *         example: true

 * /api/v1/admin/users/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a user's profile by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 * /api/v1/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get list of users for the company
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
 *           enum: [active, inactive]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [client, company]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 * /api/v1/admin/users/{userId}/status:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Set a user's active status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetActiveRequest'
 *     responses:
 *       '200':
 *         description: User status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
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
 *
 * /api/v1/admin/services:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a new service (company user/admin)
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
 *
 *   get:
 *     tags:
 *       - Admin
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
 *
 * /api/v1/admin/services/{serviceId}:
 *   get:
 *     tags:
 *       - Admin
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
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   patch:
 *     tags:
 *       - Admin
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
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 
 */

/**
 * @swagger
 * /api/v1/admin/services/all-services:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Company-scoped list/search of services (includes soft-deleted when requested)
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
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: string
 *           enum: [true, false, only]
 *     responses:
 *       '200':
 *         description: List of services for the company
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
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Soft delete multiple services for the company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Services soft-deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedCount:
 *                   type: integer
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 * /api/v1/admin/services/all-services/{serviceId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a company-scoped service by id (includes soft-deleted if requested)
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
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 * /api/v1/admin/booking-settings:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Upsert booking settings (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingSettingsRequest'
 *     responses:
 *       '200':
 *         description: Booking settings updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingSettingsResponse'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized

 * /api/v1/admin/services/all-services/{serviceId}/restore:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Restore a soft-deleted service for the company
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
 *         description: Service restored
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
 *       '404':
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'

 * /api/v1/admin/services/all-services/restore:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Restore multiple soft-deleted services for the company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Services restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restoredCount:
 *                   type: integer
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/admin/bookings:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get list of bookings for the company
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
 *       - in: query
 *         name: profileId
 *         schema:
 *           type: string
 *       - in: query
 *         name: includeProfile
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingListResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/admin/booking:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a booking on behalf of a client (admin/company user)
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
 *
 * /api/v1/admin/bookings/{bookingId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get booking details by id
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
 *       - Admin
 *     summary: Update booking (admin/company user)
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
 *       '401':
 *         description: Unauthorized
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
 * /api/v1/admin/bookings/cancel/{bookingId}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Cancel (soft delete) a booking
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
 * components:
 *   schemas:
 *     CreateBookingRequest:
 *       type: object
 *       required:
 *         - profileId
 *         - deliveryType
 *         - serviceId
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Optional contact email for the booking
 *         profileId:
 *           type: string
 *           format: uuid
 *         address:
 *           type: object
 *           description: Optional temporary address object
 *         deliveryType:
 *           type: string
 *           description: Delivery type enum
 *         serviceId:
 *           type: string
 *           format: uuid
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *         pickupTime:
 *           type: string
 *         weight:
 *           type: number
 *         itemCount:
 *           type: integer
 *         additionalNotes:
 *           type: string
 *     UpdateBookingRequest:
 *       type: object
 *       properties:
 *         address:
 *           type: object
 *         deliveryType:
 *           type: string
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *         pickupTime:
 *           type: string
 *         weight:
 *           type: number
 *         itemCount:
 *           type: integer
 *         additionalNotes:
 *           type: string
 *     BookingResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customBookingId:
 *           type: string
 *         status:
 *           type: string
 *         profile:
 *           type: object
 *           description: Profile object of the booking owner
 *         serviceId:
 *           type: string
 *         unitPrice:
 *           type: number
 *           format: float
 *         currency:
 *           type: string
 *         pricingType:
 *           type: string
 *         totalAmount:
 *           type: number
 *           format: float
 *         deliveryType:
 *           type: string
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *         pickupTime:
 *           type: string
 *         itemCount:
 *           type: integer
 *         weight:
 *           type: number
 *         additionalNote:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BookingListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookingResponse'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             totalPages:
 *               type: integer
 *     BookingStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           description: New booking status (e.g., PENDING, CONFIRMED, CANCELLED, COMPLETED)
 *
 * /api/v1/admin/bookings-status/{bookingId}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update booking status (admin only)
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
 *       '401':
 *         description: Unauthorized
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
 * /api/v1/admin/bookings/{bookingId}/restore:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Restore a soft-deleted booking (admin only)
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
 *         description: Booking restored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingResponse'
 *       '401':
 *         description: Unauthorized
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
 *
 * components:
 *   schemas:
 *     StaffCalendarRequest:
 *       type: object
 *       required:
 *         - userId
 *         - date
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         date:
 *           type: string
 *           format: date
 *         notes:
 *           type: string
 *         timeSlots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TimeSlotRequest'
 *     StaffCalendarResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         notes:
 *           type: string
 *         timeSlots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TimeSlotResponse'
 *     TimeSlotRequest:
 *       type: object
 *       required:
 *         - staffCalendarId
 *         - startTime
 *         - endTime
 *       properties:
 *         staffCalendarId:
 *           type: string
 *           format: uuid
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         maxBookings:
 *           type: integer
 *         notes:
 *           type: string
 *     TimeSlotResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         staffCalendarId:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         maxBookings:
 *           type: integer
 *         notes:
 *           type: string
 *
 * /api/v1/admin/staff-calendars:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a staff calendar (admin only)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffCalendarResponse'
 *       '400':
 *         description: Validation error
 *   get:
 *     tags:
 *       - Admin
 *     summary: List staff calendars
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
 * /api/v1/admin/staff-calendars/{calendarId}:
 *   get:
 *     tags:
 *       - Admin
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StaffCalendarResponse'
 *       '404':
 *         description: Not found
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a staff calendar
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
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a staff calendar (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: calendarId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Deleted
 *
 * /api/v1/admin/timeslots:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a timeslot (admin only)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeSlotResponse'
 *   get:
 *     tags:
 *       - Admin
 *     summary: List timeslots
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
 * /api/v1/admin/timeslots/{timeslotId}:
 *   get:
 *     tags:
 *       - Admin
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeSlotResponse'
 *       '404':
 *         description: Not found
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a timeslot
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
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a timeslot (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: timeslotId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PromoCodeRequest:
 *       type: object
 *       required:
 *         - code
 *         - serviceId
 *         - type
 *         - value
 *       properties:
 *         code:
 *           type: string
 *           example: SPRING10
 *         description:
 *           type: string
 *         serviceId:
 *           type: string
 *         type:
 *           type: string
 *           enum: [PERCENTAGE, FIXED_AMOUNT]
 *         value:
 *           type: number
 *           example: 10
 *         currency:
 *           type: string
 *           enum: [DOLLAR, NAIRA, POUNDS]
 *         startsAt:
 *           type: string
 *           format: date-time
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         usageLimit:
 *           type: integer
 *         perUserLimit:
 *           type: integer
 *         isActive:
 *           type: boolean
 *     PromoCodeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         serviceId:
 *           type: string
 *         type:
 *           type: string
 *         value:
 *           type: number
 *         currency:
 *           type: string
 *         isActive:
 *           type: boolean
 *         startsAt:
 *           type: string
 *           format: date-time
 *         expiresAt:
 *           type: string
 *           format: date-time
 *     PromoCodeListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/PromoCodeResponse'
 *
 * /api/v1/admin/promocodes:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create a promo code for a service (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromoCodeRequest'
 *     responses:
 *       '201':
 *         description: Promo created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodeResponse'
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *   get:
 *     tags:
 *       - Admin
 *     summary: List promo codes (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: List of promo codes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodeListResponse'
 *
 * /api/v1/admin/promocodes/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a promo code by id (admin only)
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
 *         description: Promo details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodeResponse'
 *       '404':
 *         description: Not found
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update a promo code (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromoCodeRequest'
 *     responses:
 *       '200':
 *         description: Updated promo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCodeResponse'
 *       '404':
 *         description: Not found
 * 
 * /api/v1/admin/promocodes/deactivate/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Delete (deactivate) a promo code (admin only)
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
 *         description: Deleted
 *

 *
 * /api/v1/admin/analysis/promousages:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: List promo usage records
 *     responses:
 *       '200':
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *
 * /api/v1/admin/analysis/promousages/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: Get a promo usage record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *   delete:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a promo usage record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Deleted
 *
 * /api/v1/admin/analysis/promousages/user:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: Get promo usage for a specific user and promo code
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: promoCodeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */

export { };

