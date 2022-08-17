const dbQuery = require('@db/index');

exports.exampleController = async function (req, res) {
  const items = await dbQuery('example', 'find', []);

  return {
    code: 200,
    // content: res.locals.$t('exemple'),
    // modifyResponse: {
    //   items,
    //   message: 'All good',
    // },
  };
};