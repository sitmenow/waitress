const EntitySchema = require("typeorm").EntitySchema;

const Turn = require('../model/customer');


module.exports = new EntitySchema({
  name: "Customer",
  target: Customer,
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: true
    },
  },
});
