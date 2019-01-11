const fs = require('fs');
const stripHtml = require('string-strip-html');
const changeImage = require('../changeImage');
const changeColour = require('../changeColour');
let {
  data: { "people": oldData, peoplefiltergroups, words }
} = require("../old.json");

oldData = changeImage(oldData);
Object.keys(oldData).forEach(key => {
  const person = oldData[key];
  const newPerson = {};

  newPerson.title = person.name;
  newPerson.deck = person.description;
  newPerson.menuColour = changeColour(person.colour_scheme);
  newPerson.image = person && person.image && person.image.url;
  newPerson.titleRole = person.title__role;
  newPerson.filters = (person.people_filter_groups_people_in_filter || []).map((item) => {
    let parsedItem = peoplefiltergroups[item.replace('peoplefiltergroups ', '')].name.split(' ');
    parsedItem[0] = parsedItem[0].toLowerCase();
    return parsedItem.join('');
  }).reduce((acc, item) => ({
    ...acc,
    [item]: 'true'
  }), {});
  newPerson.words = person.words_authors &&
    Object
      .keys(words)
      .filter(word => person.words_authors.find(item => item.replace('words ', '') === word))
      .map(key => words[key].name);

  const title = newPerson.title.toLowerCase().split('%40').join('@').split('%20').join('-').trim().split(' ').join('-');
  fs.writeFileSync(`./data/people/${title}.json`, JSON.stringify(newPerson, null, 2), 'utf8');
});