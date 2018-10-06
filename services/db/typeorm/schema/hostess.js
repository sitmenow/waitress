const EntitySchema = require("typeorm").EntitySchema;

const Hostess = require('../model/hostess');


module.exports = new EntitySchema({
  name: "Hostess",
  target: Hostess,
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: true,
    }
  },
});
