
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
 */

export {};
