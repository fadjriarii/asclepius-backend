const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

async function loadModel() {
    return tf.loadGraphModel(process.env.MODEL_URL || 'https://storage.googleapis.com/model-asclepius/model-in-prod/model.json');
}
module.exports = loadModel;