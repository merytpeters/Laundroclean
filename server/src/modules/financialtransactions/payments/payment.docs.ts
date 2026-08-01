/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentCardDetails:
 *       type: object
 *       required:
 *         - cardNumber
 *         - expiryMonth
 *         - expiryYear
 *         - cvv
 *         - cardHolderName
 *       properties:
 *         cardNumber:
 *           type: string
 *           example: "5399838383838381"
 *         expiryMonth:
 *           type: string
 *           example: "12"
 *         expiryYear:
 *           type: string
 *           example: "2028"
 *         cvv:
 *           type: string
 *           example: "123"
 *         cardHolderName:
 *           type: string
 *           example: "Jane Doe"
 *
 *     PaymentUserInfo:
 *       type: object
 *       properties:
 *         customerName:
 *           type: string
 *           example: "Jane Doe"
 *         UserPhone:
 *           type: string
 *           example: "+2348012345678"
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         userMobile:
 *           type: string
 *           example: "+2348012345678"
 *
 *     PaymentPosDeviceInput:
 *       type: object
 *       required:
 *         - serialNumber
 *       properties:
 *         name:
 *           type: string
 *           example: "Front desk POS"
 *         serialNumber:
 *           type: string
 *           example: "T2m239847561"
 *
 *     PaymentBankTransferDetails:
 *       type: object
 *       required:
 *         - senderBankName
 *         - senderAccountName
 *       properties:
 *         senderBankName:
 *           type: string
 *           example: "First Bank"
 *         senderAccountName:
 *           type: string
 *           example: "Jane Doe"
 *         senderTransactionRef:
 *           type: string
 *           example: "TRX-1234567890"
 *         transferredAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-01T10:00:00.000Z"
 *
 *     InitiatePaymentRequest:
 *       type: object
 *       required:
 *         - provider
 *         - status
 *         - amount
 *         - channel
 *         - currency
 *         - bookingId
 *         - userId
 *       properties:
 *         provider:
 *           type: string
 *           enum: [PAYSTACK, OPAY, INTERNAL]
 *           example: OPAY
 *         status:
 *           type: string
 *           enum: [INITIATED, PENDING, SUCCESS, FAILED, REVERSED, EXPIRED, ABANDONED, REFUNDED, PARTIALLY_REFUNDED, PENDING_VERIFICATION, REJECTED]
 *           example: INITIATED
 *         amount:
 *           type: integer
 *           example: 15000
 *         channel:
 *           type: string
 *           enum: [BANKCARD, BANK_TRANSFER, OPAY_WALLET, POS, CASH]
 *           example: BANKCARD
 *         currency:
 *           type: string
 *           enum: [DOLLAR, NAIRA, POUNDS]
 *           example: NAIRA
 *         card:
 *           $ref: '#/components/schemas/PaymentCardDetails'
 *         userInfo:
 *           $ref: '#/components/schemas/PaymentUserInfo'
 *         sn:
 *           $ref: '#/components/schemas/PaymentPosDeviceInput'
 *         bankDetails:
 *           $ref: '#/components/schemas/PaymentBankTransferDetails'
 *         bookingId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174001
 *
 *     PaymentManualUpdateRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [INITIATED, PENDING, SUCCESS, FAILED, REVERSED, EXPIRED, ABANDONED, REFUNDED, PARTIALLY_REFUNDED, PENDING_VERIFICATION, REJECTED]
 *           example: PENDING_VERIFICATION
 *         providerRef:
 *           type: string
 *           example: "internal-cash-123456"
 *
 *     PaymentProofCreateRequest:
 *       type: object
 *       required:
 *         - paymentId
 *         - fileUrl
 *       properties:
 *         paymentId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         fileUrl:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/proofs/payment-proof.jpg
 *         fileName:
 *           type: string
 *           example: receipt.jpg
 *         mimeType:
 *           type: string
 *           example: image/jpeg
 *         uploadedBy:
 *           type: string
 *           example: Jane Doe
 *         proof:
 *           type: string
 *           format: binary
 *           description: Uploaded proof file
 *
 *     PaymentProofUpdateRequest:
 *       type: object
 *       properties:
 *         publicId:
 *           type: string
 *           example: payment/proof/abc123
 *         fileUrl:
 *           type: string
 *           format: uri
 *           example: https://cdn.example.com/proofs/payment-proof-updated.jpg
 *         fileName:
 *           type: string
 *           example: updated-receipt.jpg
 *         mimeType:
 *           type: string
 *           example: image/jpeg
 *         proof:
 *           type: string
 *           format: binary
 *           description: Uploaded replacement proof file
 *
 *     PaymentTransactionResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         bookingId:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         paidAmount:
 *           type: integer
 *         platformFee:
 *           type: integer
 *         merchantAmount:
 *           type: integer
 *         currency:
 *           type: string
 *           enum: [DOLLAR, NAIRA, POUNDS]
 *         status:
 *           type: string
 *         paidAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         transactionRef:
 *           type: string
 *
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         transactionId:
 *           type: string
 *           format: uuid
 *         provider:
 *           type: string
 *           enum: [PAYSTACK, OPAY, INTERNAL]
 *         providerRef:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [INITIATED, PENDING, SUCCESS, FAILED, REVERSED, EXPIRED, ABANDONED, REFUNDED, PARTIALLY_REFUNDED, PENDING_VERIFICATION, REJECTED]
 *         amount:
 *           type: integer
 *         channel:
 *           type: string
 *           nullable: true
 *         authorization:
 *           type: object
 *           nullable: true
 *           description: Optional provider authorization payload
 *         currency:
 *           type: string
 *           enum: [DOLLAR, NAIRA, POUNDS]
 *         initiatedAt:
 *           type: string
 *           format: date-time
 *         paidAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         senderBankName:
 *           type: string
 *           nullable: true
 *         senderAccountName:
 *           type: string
 *           nullable: true
 *         senderTransactionRef:
 *           type: string
 *           nullable: true
 *         transferredAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         transaction:
 *           $ref: '#/components/schemas/PaymentTransactionResponse'
 *
 *     PaymentProofResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: ckx123abc456def789ghi012
 *         paymentId:
 *           type: string
 *           format: uuid
 *         fileUrl:
 *           type: string
 *           format: uri
 *         publicId:
 *           type: string
 *         fileName:
 *           type: string
 *           nullable: true
 *         mimeType:
 *           type: string
 *           nullable: true
 *         uploadedBy:
 *           type: string
 *           nullable: true
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *
 *     PaymentActionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Payment initiated successfully.
 *         data:
 *           $ref: '#/components/schemas/PaymentResponse'
 *
 *     PaymentProofActionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Payment proof uploaded successfully.
 *         data:
 *           $ref: '#/components/schemas/PaymentProofResponse'
 *
 * tags:
 *   - name: Payment
 *     description: Payment and payment proof routes
 *
 * paths:
 *   /api/payments/initiate:
 *     post:
 *       tags:
 *         - Payment
 *       summary: Initiate a payment
 *       description: Creates a payment for a booking and user. Company users can initiate payment on behalf of a customer.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InitiatePaymentRequest'
 *       responses:
 *         '201':
 *           description: Payment initiated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PaymentActionResponse'
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
 *
 *   /api/payments/proof:
 *     post:
 *       tags:
 *         - Payment
 *       summary: Upload payment proof
 *       description: Uploads a proof of payment for bank transfer payments.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               $ref: '#/components/schemas/PaymentProofCreateRequest'
 *       responses:
 *         '201':
 *           description: Payment proof uploaded successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PaymentProofActionResponse'
 *         '400':
 *           description: Validation or upload error
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
 *         '404':
 *           description: Payment not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /api/payments/proof/{proofId}:
 *     patch:
 *       tags:
 *         - Payment
 *       summary: Update a payment proof
 *       description: Updates payment proof metadata, or replaces the uploaded file if a new file is sent.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: proofId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               $ref: '#/components/schemas/PaymentProofUpdateRequest'
 *       responses:
 *         '200':
 *           description: Payment proof updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PaymentProofActionResponse'
 *         '400':
 *           description: Validation or upload error
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
 *         '404':
 *           description: Payment proof not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /api/payments/companyuser/proof/{proofId}:
 *     patch:
 *       tags:
 *         - Payment
 *       summary: Update a payment proof as a company user
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: proofId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               $ref: '#/components/schemas/PaymentProofUpdateRequest'
 *       responses:
 *         '200':
 *           description: Payment proof updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PaymentProofActionResponse'
 *         '400':
 *           description: Validation or upload error
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
 *         '404':
 *           description: Payment proof not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /api/payments/{paymentId}:
 *     get:
 *       tags:
 *         - Payment
 *       summary: Get a payment by id
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: paymentId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Payment retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: Payment retrieved successfully.
 *                   data:
 *                     $ref: '#/components/schemas/PaymentResponse'
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
 *         '404':
 *           description: Payment not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 * 
 *   /api/payments/companyuser/update/{paymentId}:
 *     patch:
 *       tags:
 *         - Payment
 *       summary: Update a payment manually
 *       description: Marks a payment as verified or updates its provider reference. Company users only.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: paymentId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentManualUpdateRequest'
 *       responses:
 *         '200':
 *           description: Payment verification update successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: Payment verification update successful.
 *                   data:
 *                     $ref: '#/components/schemas/PaymentResponse'
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
 *         '404':
 *           description: Payment not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *
 *   /api/payments/companyuser/{paymentId}:
 *     get:
 *       tags:
 *         - Payment
 *       summary: Get a payment by id as a company user
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: paymentId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Payment retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: Payment retrieved successfully.
 *                   data:
 *                     $ref: '#/components/schemas/PaymentResponse'
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
 *         '404':
 *           description: Payment not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/ErrorResponse'
 */

export {};
