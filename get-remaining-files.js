const files = require("./urls.json");
const fs = require("fs");

let remainingFiles = [];

files.forEach(file => {
  const { filename } = file;
  try {
    fs.readFileSync(`./uploads/${filename}`, "utf8");
  } catch (_) {
    remainingFiles = [...remainingFiles, file];
  }
});

remainingFiles = remainingFiles
  .filter(f => !f.filename.includes(".mp3"))
  .map(({ url }) => url)
  .join("\n");

fs.writeFileSync("./remaining.txt", remainingFiles, "utf8");
