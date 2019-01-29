require('dotenv').config();
const config = require('config');
const minimist = require('minimist');
const mongoose = require('mongoose');

const mongooseStore = require('./scheduler/stores/mongoose');
const HostessModel = require('./services/db/mongoose/models/hostess');
const BranchModel = require('./services/db/mongoose/models/branch');


const argv = minimist(process.argv.slice(2));
console.log(argv);

async function createBranch() {
  const model = new BranchModel({
    name: 'Branch Seed',
    location: {
      type: 'Point',
      coordinates: [10, 10],
    },
    isOpen: true,
    address: 'Branch Seed Address',
    restaurantId: mongoose.Types.ObjectId(),
  });

  await model.save();
  console.log(model);

  return model;
}

async function createHostess(branch) {
  const model = new HostessModel({
    _id: mongoose.Types.ObjectId(config.entities.hostess),
    name: 'Hostess Seed',
    branchId: branch.id,
  });

  await model.save();
  console.log(model);

  return model;
}


mongooseStore(config)
  .then(createBranch)
  .then(createHostess)
  .catch(error =>
    console.log(`Error while connecting to Mongo: ${error}`)
  );
