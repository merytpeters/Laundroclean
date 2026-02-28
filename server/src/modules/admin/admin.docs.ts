
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
 *           example: Acme Admin
 *         email:
 *           type: string
 *           format: email
 *           example: admin@acme.example
 *         password:
 *           type: string
 *           format: password
 *           example: StrongPass!23
 *         companyId:
 *           type: string
 *           example: 123e4567-e89b-12d3-a456-426614174000
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
 *     CompanyRoleRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: Manager
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["read:bookings", "manage:staff"]
 *     CompanyRoleResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         title:
 *           type: string
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
 *               $ref: '#/components/schemas/CompanyRoleResponse'
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
 */

export {};
