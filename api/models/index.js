const { model } = require('mongoose');

const ExampleSchema = require('@models/Example');

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
    Model: model('example', ExampleSchema),
    names: generateNames('example', ['ex', 'examples']),
  },
];
