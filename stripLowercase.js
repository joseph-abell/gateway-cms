const glob = require("glob");
const fs = require("fs");

glob("./uploads/*", (error, files) => {
  if (error) {
    console.log(error);
    return -1;
  }

  files
    .filter(
      f =>
        f.includes("jpg") ||
        f.includes("JPG") ||
        f.includes("jpeg") ||
        f.includes("gif") ||
        f.includes("png") ||
        f.includes("PNG")
    )
    .forEach(oldFileName => {
      const newFileName = oldFileName
        .split("%20")
        .join(" ")
        .split("%22")
        .join("-")
        .split("%26")
        .join("&");
      if (newFileName !== oldFileName) {
        const data = fs.readFileSync(oldFileName);

        fs.writeFileSync(newFileName, data);
        fs.unlinkSync(oldFileName);
      }
    });
});
