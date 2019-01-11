const glob = require("glob");
const fs = require("fs");

glob("./data/**/*.json", (_, data) => {
  data.forEach(filename => {
    let file = JSON.parse(fs.readFileSync(filename, "utf8"));
    const entries = Object.entries(file)
      .filter(e => typeof e[1] === "string")
      .filter(e => e[1].includes(".mp3"))
      .map(e => [
        e[0],
        e[1].replace(
          "/uploads/",
          "https://s3-eu-west-1.amazonaws.com/gatewaychurchyork/"
        )
      ])
      .forEach(e => {
        file[e[0]] = e[1];
      });
    fs.writeFileSync(filename, JSON.stringify(file, null, 2), "utf8");
  });
});
