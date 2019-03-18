const https = require('https');
const http = require('http');
const fetch = require('isomorphic-fetch');
const sound = require('music-metadata');
const fs = require('fs');
const util = require('util');

function httpGet(url) {
  let cleanedUrl = url;
  if (url.includes('/uploads') && !url.includes('gateway-cms'))
    cleanedUrl = `http://gateway-cms.netlify.com${url}`;

  return new Promise((resolve, reject) => {
    let httpType = https;
    if (cleanedUrl.includes('http://')) {
      httpType = http;
    }
    httpType.get(cleanedUrl, async function(res) {
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
  const podcasts = Object.entries(wordsData).filter(
    word => word[1].data.showOnPodcast,
  );

  // Setting podcastFile section
  podcasts.forEach(word => {
    const wordData = word[1];
    const localDirectory = `./data/words/${word[0]}`;

    if (
      !wordData.podcastFile ||
      wordData.podcastFile !== (wordData.audioFile || wordData.file)
    ) {
      const fileData = JSON.parse(fs.readFileSync(localDirectory, 'utf-8'));

      let podcastFile = fileData.audioFile || fileData.file;
      if (
        podcastFile &&
        podcastFile.length > 0 &&
        podcastFile.includes('/uploads') &&
        !podcastFile.includes('gateway-cms')
      ) {
        podcastFile = `http://gateway-cms.netlify.com${podcastFile}`;
      }

      fileData.podcastFile = podcastFile;

      fs.writeFileSync(
        localDirectory,
        JSON.stringify(fileData, null, 2),
        'utf-8',
      );
    }
  });

  let count = 0;
  podcasts.forEach(async podcast => {
    if (count > 0) return;
    const item = podcast[1];

    let podcastFile = item.data.podcastFile || '';
    if (
      (podcastFile || '').trim().length > 0 &&
      (!item.data.contentType || !item.data.duration)
    ) {
      count = count + 1;
      const httpData = await httpGet(podcastFile).catch(e => e);
      if (httpData.statusCode === 200) {
        const contentLength = httpData.headers['content-length'];
        const contentType = httpData.headers['content-type'];
        const data = JSON.parse(
          fs.readFileSync('./data/words/' + podcast[0], 'utf-8'),
        );
        data.contentLength = contentLength;
        data.contentType = contentType;
        delete data.metadata;
        const result = await sound.parseStream(httpData, contentType, {
          native: true,
        });
        const {format} = result;
        const {duration} = format;
        console.log(result.native, podcastFile);
        data.duration = duration;
        fs.writeFileSync(
          './data/words/' + podcast[0],
          JSON.stringify(data, null, 2),
          'utf-8',
        );
      }
    }
  });
})();
