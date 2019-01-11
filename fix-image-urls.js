const glob = require("glob");
const fs = require("fs");

glob("data/**/*.json", (err, files) => {
  files.forEach(file => {
    let data = JSON.parse(fs.readFileSync(file, "utf8"));
    const filteredData = Object.entries(data).filter(d => {
      if (typeof d[1] !== "string") return false;
      const value = d[1].toLowerCase();

      return (
        value.includes(".jpg") ||
        value.includes(".png") ||
        value.includes(".gif") ||
        value.includes(".jpeg")
      );
    });
    console.log(filteredData);
  });
});
