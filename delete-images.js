const glob = require("glob");
const fs = require("fs");

try {
  glob("uploads/*.?(jpg|png)", null, (error, largeFiles) => {
    if (error) {
      throw error;
    }

    glob(
      "uploads/?(mobile|tablet|desktop)/*.?(jpg|png)",
      null,
      (error, mobileFiles) => {
        if (error) {
          throw error;
        }

        const deletedFiles = mobileFiles.filter(mobileFile => {
          return !largeFiles.includes(mobileFile);
        });

        deletedFiles.forEach(deletedFile => {
          fs.unlink(deletedFile, err => {
            if (err) throw err;
            console.log(`${deletedFile} was deleted`);
          });
        });
      }
    );
  });
} catch (e) {}
