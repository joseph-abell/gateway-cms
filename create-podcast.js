const https = require('https');
const fetch = require('isomorphic-fetch');
const sound = require('music-metadata');
const {DateTime} = require('luxon');
const xml = require('prettify-xml');
const fs = require('fs');
const {promisify} = require('es6-promisify');
const get = promisify(https.get);

let podcast = '';

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, async function(res) {
      switch (res.statusCode) {
        case 200:
          return resolve(res);
        case 302: // redirect
          return httpGet(res.headers.location, cb);
        default:
          return reject(
            new Error('Unexpected status-code:' + res.statusCode + ' ' + url),
          );
      }
    });
  });
}

const createElement = (elementName, attributes = [], selfClose = false) => {
  if (elementName) {
    podcast = podcast.concat('<', elementName);

    attributes.forEach(attribute => {
      podcast = podcast.concat(' ', attribute.name, '="', attribute.value, '"');
    });

    if (selfClose) {
      podcast = podcast.concat('/');
    }

    podcast = podcast.concat('>');
  }
};

const createText = (text = '') => {
  podcast = podcast.concat(text);
};

(async () => {
  const podcastInfoRequest = await fetch(
    'http://gateway-cms.netlify.com/data/podcast-info.json',
  );
  const data = await podcastInfoRequest.json();

  const wordsRequest = await fetch(
    'http://gateway-cms.netlify.com/data/words/index.json',
  );
  const wordsData = await wordsRequest.json();

  let podcasts = Object.values(wordsData);

  podcasts = (podcasts || [])
    .filter(podcast => (podcast || {}).data.showOnPodcast)
    .sort((a, b) => {
      const aDate = parseInt(a.data.date.split('-').join(''));
      const bDate = parseInt(b.data.date.split('-').join(''));

      return aDate - bDate;
    });
  createText('<?xml version="1.0" encoding="UTF-8"?>');

  createElement('rss', [
    {name: 'version', value: '2.0'},
    {
      name: 'xmlns:itunes',
      value: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    },
  ]);

  createElement('channel');

  createElement('title');
  createText(data.title);
  createElement('/title');

  createElement('link');
  createText(data.link);
  createElement('/link');

  createElement('language');
  createText('en');
  createElement('/language');

  if (data.copyright) {
    createElement('copyright');
    podcast = podcast.concat('© ', data.copyright);
    createElement('/copyright');
  }

  if (data.subtitle) {
    createElement('itunes:subtitle');
    podcast = podcast.concat(data.subtitle);
    createElement('/itunes:subtitle');
  }

  if (data.author) {
    createElement('itunes:author');
    podcast = podcast.concat(data.author);
    createElement('/itunes:author');
  }

  if (data.summary) {
    createElement('itunes:summary');
    podcast = podcast.concat(data.summary);
    createElement('/itunes:summary');

    createElement('description');
    podcast = podcast.concat(data.summary);
    createElement('/description');
  }

  if (data.ownerName) {
    createElement('itunes:owner');

    createElement('itunes:name');
    createText(data.ownerName);
    createElement('/itunes:name');

    createElement('itunes:email');
    createText(data.supportEmail);
    createElement('/itunes:email');

    createElement('/itunes:owner');
  }

  createElement(
    'itunes:image',
    [
      {
        name: 'href',
        value: `https://data.gatewaychurch.co.uk${data.image}`,
      },
    ],
    true,
  );

  createElement(
    'itunes:category',
    [{name: 'text', value: 'Religion & Spirituality'}],
    true,
  );

  createElement('itunes:explicit');
  createText('no');
  createElement('/itunes:explicit');

  podcasts.forEach(async (item = {}, index) => {
    const {data = {}} = item;
    let {audioFile = ''} = data;
    audioFile = audioFile
      .split('%20')
      .join('-')
      .toLowerCase();
    let podcastFile = item.data.audioFile || item.data.file;
    if (
      podcastFile &&
      podcastFile.includes('/uploads') &&
      !podcastFile.includes('gateway-cms')
    ) {
      podcastFile = `http://gateway-cms.netlify.com${podcastFile}`;
    }
    const size = item.data.contentLength;
    if (podcastFile) {
      createElement('item');

      createElement(
        'enclosure',
        [
          {
            name: 'url',
            value: podcastFile,
          },
          {name: 'length', value: size},
          {name: 'type', value: 'audio/mpeg'},
        ],
        true,
      );

      createElement('description');
      createText(item.data.deck);
      createElement('/description');

      const date = DateTime.fromISO(item.data.date).toHTTP();

      createElement('guid');
      createText(`${item.data.title} - ${date}`);
      createElement('/guid');

      createElement('title');
      createText(item.data.title);
      createElement('/title');

      createElement('pubDate');
      createText(date);
      createElement('/pubDate');

      if (item.data.authors && item.data.authors.length) {
        item.data.authors.forEach(({author}) => {
          createElement('author');
          createText(author);
          createElement('/author');
        });
      }

      if (item.data.itunesImage) {
        createElement('itunes:image');
        createText(item.data.itunesImage);
        createElement('/itunes:image');
      }

      createElement('itunes:explicit');
      createText('no');
      createElement('/itunes:explicit');

      createElement('itunes:isClosedCaptioned');
      createText('no');
      createElement('/itunes:isClosedCaptioned');

      createElement('itunes:duration');
      createText(item.data.duration);
      createElement('/itunes:duration');

      if (item.data.itunesImage) {
        createElement(
          'itunes:image',
          [
            {
              name: 'href',
              value: `https://data.gatewaychurch.co.uk${item.data.itunesImage}`,
            },
          ],
          true,
        );
      } else if (data.defaultImage) {
        createElement(
          'itunes:image',
          [
            {
              name: 'href',
              value: `https://data.gatewaychurch.co.uk${data.image}`,
            },
          ],
          true,
        );
      }

      createElement('/item');
    }
  });

  createElement('/channel');
  createElement('/rss');

  fs.writeFileSync('./data/feed.xml', xml(podcast), 'utf8');
})();
