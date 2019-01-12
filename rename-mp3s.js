const glob = require('glob');
const fs = require('fs');
const flat = require('flat');
const encodeurl = require('encodeurl');
const fetch = require('isomorphic-fetch');
const {promisify} = require('es6-promisify');

const f = promisify(fetch);
const g = promisify(glob);
console.log(f);

(async () => {
  const filenames = await g('data/words/*.*', {});

  filenames.forEach(filename => {
    const file = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const flatFile = flat(file);
    const mp3s = Object.values(flatFile).filter(
      f => typeof f === 'string' && f.includes('.mp3'),
    ).map(f => ({
      old: f,
      new: f.split('%20').join('%2520')
    }))
    let result = JSON.stringify(file, null, 2);
    mp3s.forEach(mp3 => {
      result = result.split(mp3.old).join(mp3.n);
    });
    fs.writeFileSync(filename, result, 'utf8');
  });
})();
