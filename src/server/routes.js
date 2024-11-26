const postPredictHandler = require('./handlers/postPredictHandler');
const historyHandler = require('./handlers/historyHandler');

const routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 1000000 // 1MB limit
            }
        }
    },
    {
        path: '/predict/histories',
        method: 'GET',
        handler: historyHandler
    }
];

module.exports = routes;
