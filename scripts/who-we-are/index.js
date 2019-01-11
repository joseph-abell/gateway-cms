const fs = require('fs');
const stripHtml = require('string-strip-html');
const changeImage = require('../changeImage');
const changeColour = require('../changeColour');
let {
  data: { pages: { "-K1tJaoXK1LNZ-G24_f8": oldData } }
} = require("../old.json");

oldData = changeImage(oldData);

const newData = {};

newData.title = oldData.name;

newData.header = {};
newData.header.image = oldData.header_image.url;
newData.header.menuColour = changeColour(oldData.colour_scheme);

newData.subtitle = {};
newData.subtitle.subtitle = '';
newData.subtitle.image = oldData.summary_image.url;

newData.deck = {};
newData.deck.title = oldData.summary_header.trim();
newData.deck.paragraph = oldData.summary_content;
newData.deck.colour = changeColour(oldData.colour_scheme);

newData.contents = oldData.page_content.reduce((acc, item) => {
  const imageTest = item.image && item.image.url;
  const isFullScreen = item.width_percentage === 'One Hundred';

  // new item
  if (Object.keys(acc.item).length === 0) {
    // if is fullscreen, add item to left, create empty right object
    if (isFullScreen) {
      return {
        result: [...acc.result, {
          content: {
            left: {
              deck: item.content && stripHtml(item.content),
              image: imageTest,
              colour: changeColour(item.colour_scheme)
            },
            right: {
                deck: undefined,
            image: undefined,
              colour: changeColour(item.colour_scheme)
            }
          }
        }],
        item: {}
      };
    } else {
      // fill out only the left side of the item.
      return {
        result: acc.result,
        item: {
          left: {
            deck: item.content && stripHtml(item.content),
            image: imageTest,
            colour: changeColour(item.colour_scheme)
          }
        }
      }
    }
  } else {
    return {
      result: [...acc.result, { content: { left: acc.item.left, right: {
        deck: item.content && stripHtml(item.content),
        image: imageTest,
        colour: changeColour(item.colour_scheme)
      }}}],
      item: {}
    }
  }
}, {result: [], item: {}}).result;

newData.optionalContent = 'noContent';

fs.writeFileSync('./data/pages/who-we-are.json', JSON.stringify(newData, null, 2), 'utf8');