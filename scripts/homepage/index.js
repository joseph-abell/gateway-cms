const fs = require('fs');
const changeImage = require('../changeImage');
const changeColour = require('../changeColour');
let {
  data: { homepage }
} = require("../old.json");

homepage = changeImage(homepage);

const newData = {};

newData.header = {};
newData.header.title = homepage.name;
newData.header.image = homepage.header_background_image.url;
newData.header.menuColour = changeColour(homepage.colour_scheme);

newData.cta = homepage.hero_banner.map((banner) => ({
  title: banner.title,
  deck: banner.summary,
  link: banner.link.replace('/what-we-do', ''),
  image: banner.image.url,
  colour: changeColour(banner.colour_scheme)
}));

newData.quotes = homepage.quotes;

newData.deck = {};
newData.deck.text = homepage.page_content[0].content;
newData.deck.colour = changeColour(homepage.page_content[0].colour_scheme);
newData.deck.image = homepage.page_content[1].image.url;

newData.eventsImage = homepage.page_content[2].image.url;
newData.twitterImage = homepage.page_content[5].image.url;

fs.writeFileSync('./data/homepage.json', JSON.stringify(newData, null, 2), 'utf8');