const predictClassification = require('../../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../../services/storeData');
const InputError = require('../../exceptions/InputError');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        console.log('Received image with size:', image.length);

        const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            explanation,
            suggestion,
            confidenceScore,
            createdAt
        };

        await storeData(id, data);

        const response = h.response({
            status: 'success',
            message: confidenceScore > 50 ? 'Model is predicted successfully.' : 'Model is predicted successfully but under threshold.',
            data
        }).code(201);

        return response;
    } catch (error) {
        console.error('Error during prediction process:', error);

        if (error instanceof InputError) {
            const response = h.response({
                status: 'fail',
                message: error.message
            }).code(error.statusCode || 400);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400);
        return response;
    }
}

module.exports = postPredictHandler;
