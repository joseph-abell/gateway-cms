const glob = require('glob');
const fs = require('fs');
const flat = require('flat');
const encodeurl = require('encodeurl');

glob('data/words/*.*', {}, (err, filenames) => {
  filenames.forEach(filename => {
    const file = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const flatFile = flat(file);
    const mp3s = Object.values(flatFile).filter(
      f => typeof f === 'string' && f.includes('.mp3'),
    ).map(old => ({old, n: encodeurl(old)}));
    let result = JSON.stringify(file, null, 2);
    mp3s.forEach(mp3 => {
      result = result.split(mp3.old).join(mp3.n)
    });
    fs.writeFileSync(filename, result, 'utf8');
  });
});
