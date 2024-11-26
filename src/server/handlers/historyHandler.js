const { Firestore } = require('@google-cloud/firestore');

async function historyHandler(request, h) {
    const db = new Firestore();
    const predictions = await db.collection('prediction').get();

    const data = predictions.docs.map(doc => ({
        id: doc.id,
        history: doc.data()
    }));

    const response = h.response({
        status: 'success',
        data
    }).code(200);

    return response;
}

module.exports = historyHandler;
