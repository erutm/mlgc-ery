const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const getData = require('../services/getData');
 
async function postPredictHandler(request, h) {
  try {
      const { image } = request.payload;
      const { model } = request.server.app;

      const { label, suggestion } = await predictClassification(model, image);
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();

      const data = {
          "id": id,
          "result": label,
          "suggestion": suggestion,
          "createdAt": createdAt
      };

      await storeData(id, data);

      const response = h.response({
          status: 'success',
          message: 'Model is predicted successfully',
          data
      });
      response.code(201);
      return response;
  } catch (error) {
      const response = h.response({
          status: 'fail',
          message: error.message
      });
      response.code(400);
      return response;
  }
}
 
async function postPredictHistoriesHandler(request, h) {
  try {
    const allData = await getData();

    if (allData.length === 0) {
      return h.response({
        status: 'success',
        message: 'Tidak ada riwayat prediksi yang ditemukan'
      }).code(404);
    }

    const response = h.response({
      status: 'success',
      data: allData
    });
    response.code(200);
    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Error during retrieving histories:", error.message);

    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam mengambil riwayat prediksi'
    });
    response.code(500);
    return response;
  }
}

module.exports = { postPredictHandler, postPredictHistoriesHandler };