const queryDb = require('@db/index');

exports.create = async function createPunchline(req, res, session) {
  const punchline = await queryDb('punchlines', 'create', [req.body], { session });
  return {
    code: 200,
    modifyResponse: {
      punchline_id: punchline._id,
    },
  };
}

exports.delete = async function deletePunchline(req, res, session) {
  await queryDb('punchline', 'deleteOneById', [req.params.id], { session });
  return {
    code: 204,
  };
}