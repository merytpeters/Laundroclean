import asyncHandler from '../../../utils/asyncHandler.js';
import { opayService } from '../paymentProviders/opay.service.js';
import { webhookService } from './webhook.service.js';


const opayWebhookController = asyncHandler(async (req, res) => {
    const signature = req.get('x-opay-signature') ?? '';
    if (!opayService.verifyWebhook(
        JSON.stringify(req.body),
        signature)) {
        return res.status(401).json({
            success: false,
            message: 'Invalid webhook signature.',
        });
    }

    const payload = opayService.parseWebhook(req.body);

    await webhookService.handleWebhook(payload);

    return res.status(200).json({
        success: true,
    });
});


export default {
    opayWebhookController,
};