const glob = require('glob');
const fs = require('fs');

glob('./data/words/*', null, (err, files) => {
  files
    .filter(file => file !== './data/words/index.json')
    .forEach(file => {
      const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
      const splitAudioFile = data.audioFile && data.audioFile.split('/');
      let audioNumber =
        splitAudioFile &&
        splitAudioFile
          .pop()
          .split('%2520')[0]
          .split('_')[0]
          .split('-')[0];
      if (audioNumber && audioNumber.length < 8) {
        audioNumber = `20${audioNumber}`;
      }
      const audioDirectory = splitAudioFile && splitAudioFile.join('/');
      const audioFileName =
        audioNumber && `${audioDirectory}/${audioNumber}.mp3`;

      data.audioFile = audioFileName;
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    });
});
