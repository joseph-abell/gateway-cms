const glob = require("glob");
const fs = require("fs");

glob("./data/**/*.json", (_, data) => {
  data.forEach(fileName => {
    let file = JSON.parse(fs.readFileSync(fileName, "utf8"));
    const entries = Object.entries(file)
      .filter(entry => {
        if (Array.isArray(entry[1])) return false;
        return (
          typeof entry[1] === "string" &&
          (entry[1].includes(".jpg") ||
            entry[1].includes(".jpeg") ||
            entry[1].includes(".gif") ||
            entry[1].includes(".png"))
        );
      })
      .map(entry => [
        entry[0],
        entry[1]
          .toLowerCase()
          .split("%20")
          .join(" ")
          .split("%22")
          .join("-")
          .split("%26")
          .join("&")
      ])
      .forEach(entry => {
        file[entry[0]] = entry[1];
      });
    fs.writeFileSync(fileName, JSON.stringify(file, null, 2), "utf8");
  });
});
