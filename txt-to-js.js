const fs = require("fs");

let urls = fs.readFileSync("./urls.txt", "utf8");
urls = urls.split(/\n/g);
urls = urls.map(url => {
  let filename = url.split("/");
  filename = filename[filename.length - 1];
  return { url, filename };
});

fs.writeFileSync("./urls.js", JSON.stringify(urls, null, 2), "utf8");
