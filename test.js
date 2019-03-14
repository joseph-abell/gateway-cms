const fetch = require('isomorphic-fetch');
(async () => {
  const result = await fetch(
    'https://s3-eu-west-1.amazonaws.com/gatewaychurchyork/20181118%2520-%2520John%2520Wilson.mp3',
  ).then(res => res.ok);
})();
