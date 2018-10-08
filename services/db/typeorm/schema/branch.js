const EntitySchema = require("typeorm").EntitySchema;

const Branch = require('../model/branch');


module.exports = new EntitySchema({
  name: "Branch",
  target: Branch,
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: true
    },
  },
});
