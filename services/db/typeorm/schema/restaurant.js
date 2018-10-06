const EntitySchema = require("typeorm").EntitySchema;

const Restaurant = require('../model/restaurant');


module.exports = new EntitySchema({
  name: "Restaurant",
  target: Restaurant,
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: true
    },
  },
});
