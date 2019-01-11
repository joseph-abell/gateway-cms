const fs = require('fs');
const qs = require('query-string');
const request = require('request');
const flatten = require("./flatten");

module.exports = (data) => {
  let result = data;

  const images = Object.values(flatten(result))
    .filter(
      value => typeof value === "string" && value.includes("webhook-uploads")
    )
    .map(value => {
      const oldFileName = `http://gatewaychurch.co.uk${value}`;
      const [fileName] = Object.keys(qs.parse(value.split('/').pop(), true));

      request(oldFileName).pipe(fs.createWriteStream(`./uploads/${fileName}`));

      return ({
        old: value,
        new: `/uploads/${fileName}`
      });
  });

  result = JSON.stringify(result, null, 2);

  images.forEach(image => {
    result = result.split(image.old).join(image.new);
  });

  return JSON.parse(result);
};