const sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    // Pengecekan jumlah channel RGB (3 channel)
    const imageMetadata = await sharp(image).metadata();
    if (imageMetadata.channels !== 3) {
      throw new InputError('Gambar harus memiliki 3 channel RGB');
    }

    // Proses decoding dan transformasi menggunakan TensorFlow.js
    const tensor = tf.node
      .decodeJpeg(image, 3) // Mendekode image buffer menjadi tensor
      .resizeNearestNeighbor([224, 224]) // Mengubah ukuran image
      .expandDims() // Menambah dimensi batch
      .toFloat(); // Konversi tipe data tensor ke float

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const label = confidenceScore <= 50 ? 'Non-cancer' : 'Cancer';
    let suggestion;

    if (label === 'Cancer') {
      suggestion = "Segera periksa ke dokter!";
    } else if (label === 'Non-cancer') {
      suggestion = "Penyakit kanker tidak terdeteksi.";
    } else {
      throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
    }

    return { label, suggestion };
  } catch (error) {
    console.error("Error during prediction:", error.message);
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
  }
}

module.exports = predictClassification;