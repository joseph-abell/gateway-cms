const path = require("path");
const fs = require("fs");
const { getDataPromise, writeFile, flatten } = require("./helpers");

const getData = async pageTypes => {
  // getData is an async function, meaning we will be dealing
  // with lots of promises. let's group them all together
  // and wait until all of the data has come back.
  const promises = [];
  pageTypes.forEach(async pageType => {
    promises.push(getDataPromise(pageType, true));
  });
  const data = await Promise.all(promises);
  return data;
};

const createSearchPage = async () => {
  // I'm not including the homepage as I think all the data people
  // will be searching for will be on other pages
  const searchPage = [];

  const pageTypes = ["events", "pages", "people", "words"];
  const data = await getData(pageTypes);

  data.forEach(item => {
    const keys = Object.keys(item);

    keys.forEach(key => {
      searchPage.push({
        url: item[key].url,
        type: item[key].type,
        data: item[key].data
      });
    });
  });

  writeFile("search", "index.json", searchPage);
};

createSearchPage();
