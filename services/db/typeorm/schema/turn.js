const EntitySchema = require("typeorm").EntitySchema;

const Turn = require('../model/turn');


module.exports = new EntitySchema({
  name: "Turn",
  target: Turn,
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: true
    },
  },
});
