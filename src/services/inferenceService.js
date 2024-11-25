const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid');

async function predictClassification(model, image) {
    try {
        // Cek ukuran file gambar
        if (image.length > 1000000) {
            return {
                statusCode: 413,
                body: {
                    status: "fail",
                    message: "Payload content length greater than maximum allowed: 1000000"
                }
            };
        }

        // Preprocessing gambar
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const classes = ['Non-cancer', 'Cancer'];
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        // Struktur respon API
        const response = {
            status: "success",
            message: "Model is predicted successfully",
            data: {
                id: uuidv4(),
                result: label,
                suggestion: label === 'Cancer' 
                    ? "Segera periksa ke dokter!" 
                    : "Penyakit kanker tidak terdeteksi.",
                createdAt: new Date().toISOString()
            }
        };

        return { statusCode: 200, body: response };
    } catch (error) {
        // Kesalahan prediksi
        return {
            statusCode: 400,
            body: {
                status: "fail",
                message: "Terjadi kesalahan dalam melakukan prediksi"
            }
        };
    }
}

module.exports = predictClassification;
