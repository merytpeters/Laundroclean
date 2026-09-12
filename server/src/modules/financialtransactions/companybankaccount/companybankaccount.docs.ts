/**
 * @swagger
 * components:
 *   schemas:
 *     CompanyBankAccountRequest:
 *       type: object
 *       required:
 *         - bankName
 *         - accountName
 *         - accountNumber
 *       properties:
 *         id:
 *           type: string
 *           example: "cln_01H8Y2Z1A8993"
 *         bankName:
 *           type: string
 *           example: "Zenith Bank PLC"
 *         accountName:
 *           type: string
 *           example: "LaundroClean Ltd"
 *         accountNumber:
 *           type: string
 *           example: "214398390209328"
 *         isDefault:
 *           type: boolean
 *           example: true
 * 
 *     CompanyBankAccount:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cln_01H8Y2Z1A8993"
 *         bankName:
 *           type: string
 *           example: "Zenith Bank PLC"
 *         accountName:
 *           type: string
 *           example: "LaundroClean Ltd"
 *         accountNumber:
 *           type: string
 *           example: "214398390209328"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isDefault:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CompanyBankAccountListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CompanyBankAccount'
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
 *   - name: Company Bank Accounts
 *     description: Company bank accounts for payment purposes
 * 
 * paths:
 *   /api/v1/company-bank-account:
 *     post:
 *       tags:
 *         - Company Bank Accounts
 *       summary: Create a new bank account
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompanyBankAccountRequest'
 *       responses:
 *         '201':
 *           description: Bank account created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CompanyBankAccount'
 *         '400':
 *           description: Validation error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '403':
 *           description: Forbidden
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *     get:
 *       tags:
 *         - Company Bank Accounts
 *       summary: Get list of Company Bank Accounts
 *       description: Returns a paginated list of Company Bank Accounts
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
 *           name: isDefault
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
 *           description: A paginated list of company bank accounts
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CompanyBankAccountListResponse'
 *         '400':
 *           description: Invalid request
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse' 
 */

export {};