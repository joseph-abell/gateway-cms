const https = require('https');
const fetch = require('isomorphic-fetch');
const sound = require('music-metadata');
const fs = require('fs');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, async function(res) {
      switch (res.statusCode) {
        case 200:
          return resolve(res);
        case 302:
          return httpGet(res.headers.location);
        default:
          return reject(new Error('Unexpected statusCode: ' + res.statusCode));
      }
    });
  });
}

(async () => {
  const wordsRequest = await fetch(
    'http://gateway-cms.netlify.com/data/words/index.json',
  );
  const wordsData = await wordsRequest.json();
  const podcasts = Object.entries(wordsData)
    .filter(word => word[1].data.showOnPodcast)

    // Setting podcastFile section
    .forEach(word => {
      const wordData = word[1];
      const localDirectory = `./data/words/${word[0]}`;

      if (!wordData.podcastFile) {
        const fileData = JSON.parse(fs.readFileSync(localDirectory, 'utf-8'));
        fileData.podcastFile = fileData.audioFile || fileData.file;
        fs.writeFileSync(
          localDirectory,
          JSON.stringify(fileData, null, 2),
          'utf-8',
        );
      }
    });
  // console.log(podcasts);
})();
