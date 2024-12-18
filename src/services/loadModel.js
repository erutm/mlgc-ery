const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel('https://storage.googleapis.com/mlgc-ery/submissions-model/model.json');
}
module.exports = loadModel;