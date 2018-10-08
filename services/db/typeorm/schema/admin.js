const EntitySchema = require("typeorm").EntitySchema;

const Admin = require('../model/admin');


module.exports = new EntitySchema({
  name: "Admin",
  target: Admin,
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: true,
    }
  },
});
