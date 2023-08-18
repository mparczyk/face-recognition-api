const PAT = 'befe49d3421044a8ad32e71a3458f041';
const USER_ID = 'mparczyk';
const APP_ID = 'facedetection';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const handleApiCall = (req, res) => {
  const stub = ClarifaiStub.grpc();

  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Key " + PAT);

  stub.PostModelOutputs(
    {
        user_app_id: {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        model_id: MODEL_ID,
        version_id: MODEL_VERSION_ID,
        inputs: [
            { data: { image: { url: req.body.input, allow_duplicate_url: true } } }
        ]
    },
    metadata,
    (err, response) => {
        if (err) {
            throw new Error(err);
        }
        if (response.status.code !== 10000) {
            throw new Error("Post model outputs failed, status: " + response.status.description);
        }
        const outputs = response.outputs;
        res.json(outputs);
    }
  );
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
   
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}