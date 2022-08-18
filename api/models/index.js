const { model } = require('mongoose');

const Artists = require('@models/Artists');
const Lyrics = require('@models/Lyrics');
const Punchlines = require('@models/Punchlines');
const Users = require('@models/Users');

String.prototype.replaceAt = function replacetAt(index, replacement) {
  return (
    this.substring(0, index) + replacement + this.substring(index + replacement.length)
  );
};

function generateNames(modelName, customName) {
  const strAsArray = modelName.split('');
  const arrayToReturn = [
    modelName,
    modelName.toUpperCase(),
    modelName.replaceAt(0, strAsArray[0].toUpperCase()),
    String.prototype.concat(modelName.replaceAt(0, strAsArray[0].toUpperCase()), 's'),
    modelName.concat('s'),
    ...(customName && [...customName]),
  ];

  return arrayToReturn;
}

module.exports = [
  {
    Model: model('artists', Artists),
    names: generateNames('artists', ['artist', 'at']),
  },
  {
    Model: model('punchlines', Punchlines),
    names: generateNames('punchlines', ['punchline', 'punch']),
  },
  {
    Model: model('users', Users),
    names: generateNames('users', ['user', 'usr']),
  },
  {
    Model: model('lyrics', Lyrics),
    names: generateNames('lyric', ['ly', 'lyrics']),
  },
];
