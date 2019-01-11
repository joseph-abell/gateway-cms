const glob = require("glob");
const fs = require("fs");
const sharp = require("sharp");

glob("uploads/*.?(jpg|png|JPG|jpeg|gif|PNG)", null, (err, largeFiles) => {
  glob(
    "uploads/mobile/*.?(jpg|png|JPG|jpeg|gif|PNG)",
    null,
    (err, mobileFiles) => {
      glob(
        "uploads/tablet/*.?(jpg|png|JPG|jpeg|gif|PNG)",
        null,
        (err, tabletFiles) => {
          glob(
            "uploads/desktop/*.?(jpg|png|JPG|jpeg|gif|PNG)",
            null,
            (err, desktopFiles) => {
              const missingMobileFiles = largeFiles
                .filter(largeFile => !mobileFiles.includes(largeFile))
                .map(file => ({
                  oldFile: file,
                  newFile: file.split("/").join("/mobile/"),
                  width: 767
                }));
              const missingTabletFiles = largeFiles
                .filter(largeFile => !tabletFiles.includes(largeFile))
                .map(file => ({
                  oldFile: file,
                  newFile: file.split("/").join("/tablet/"),
                  width: 990
                }));
              const missingDesktopFiles = largeFiles
                .filter(largeFile => !desktopFiles.includes(largeFile))
                .map(file => ({
                  oldFile: file,
                  newFile: file.split("/").join("/desktop/"),
                  width: 1220
                }));
              const missingFiles = [
                ...missingMobileFiles,
                ...missingTabletFiles,
                ...missingDesktopFiles
              ];

              missingFiles.forEach(missingFile => {
                const buff = fs.readFileSync(missingFile.oldFile);
                sharp(buff)
                  .resize(missingFile.width, missingFile.width)
                  .max()
                  .withoutEnlargement(true)
                  .toFile(missingFile.newFile)
                  .then(() => {
                    console.log(`created ${missingFile.newFile}`);
                  });
              });
            }
          );
        }
      );
    }
  );
});
