/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           nullable: true
 *         avatarUrl:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *     ProfileUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *         newPassword:
 *           type: string
 *           format: password
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *
 * tags:
 *   - name: Profile
 *     description: User profile routes
 *
 * paths:
 *   /api/v1/profile:
 *     get:
 *       tags:
 *         - Profile
 *       summary: Get current user's profile
 *       responses:
 *         '200':
 *           description: User profile retrieved
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Profile'
 *         '401':
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *     patch:
 *       tags:
 *         - Profile
 *       summary: Update current user's profile
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileUpdateRequest'
 *       responses:
 *         '200':
 *           description: Profile updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Profile'
 *         '400':
 *           description: Validation error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '401':
 *           description: Unauthorized
 *
 *   /api/v1/profile/change-password:
 *     patch:
 *       tags:
 *         - Profile
 *       summary: Change the current user's password
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChangePasswordRequest'
 *       responses:
 *         '200':
 *           description: Password changed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Password changed successfully
 *         '400':
 *           description: Validation error or incorrect current password
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '401':
 *           description: Unauthorized
 *
 *   /api/v1/profile/soft-delete:
 *     patch:
 *       tags:
 *         - Profile
 *       summary: Soft delete the current user's account
 *       responses:
 *         '200':
 *           description: Account soft-deleted
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Account soft-deleted
 *         '401':
 *           description: Unauthorized
 *
 *   /api/v1/profile/pic:
 *     patch:
 *       tags:
 *         - Profile
 *       summary: Upload or update profile picture
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   format: binary
 *       responses:
 *         '200':
 *           description: Profile picture uploaded
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Profile'
 *         '400':
 *           description: Upload error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *         '401':
 *           description: Unauthorized
 *
 *     delete:
 *       tags:
 *         - Profile
 *       summary: Delete profile picture
 *       responses:
 *         '200':
 *           description: Profile picture deleted
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Profile picture removed
 *         '401':
 *           description: Unauthorized
 */

export {};
