const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        console.log('Received image of size:', image.length);

        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        console.log('Tensor shape:', tensor.shape);

        const classes = ['Cancer', 'Non-cancer'];

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        let explanation, suggestion;

        if (label === 'Cancer') {
            explanation = "This image is likely indicating cancerous features.";
            suggestion = "Please consult a doctor for further examination.";
        } else {
            explanation = "This image does not indicate cancer.";
            suggestion = "No signs of cancer detected.";
        }

        return { confidenceScore, label, explanation, suggestion };
    } catch (error) {
        console.error('Error in predictClassification:', error);
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
