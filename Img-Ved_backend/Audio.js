const express = require('express');
const bodyParser = require('body-parser');
const googleTTS = require('google-tts-api');

const app = express();

app.use(bodyParser.json());

app.post('/generate-audio', async (req, res) => {
  const { text } = req.body;

  try {
    const audioURL = googleTTS.getAudioUrl(text, {
      lang: 'en',
      slow: false,
      host: 'https://translate.google.com',
    });

    // Here, you should download the audio and store it on your server

    // For demonstration purposes, we'll just return the audio as a response
    res.status(200).send(audioURL);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating audio');
  }
});

// ... (other routes and server setup)

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
