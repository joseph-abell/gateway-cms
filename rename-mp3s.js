const glob = require('glob');
const fs = require('fs');
const flat = require('flat');

glob('data/words/*.*', {}, (err, filenames) => {
  filenames.forEach(filename => {
    const file = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const flatFile = flat(file);
    const mp3s = Object.values(flatFile).filter(f => typeof f === 'string' && f.includes('.mp3') && f.startsWith('/uploads')).map(f => ({old: f, n: `https://s3-eu-west-1.amazonaws.com/gatewaychurchyork${f}`}));
    let result = JSON.stringify(file, null, 2);
    mp3s.forEach(mp3 => {
      result = result.split(mp3.old).join(mp3.n);
    });
    fs.writeFileSync(filename, result, 'utf8');
  })
});
