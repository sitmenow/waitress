// LIST USERS      -> admin
// DETAIL USER     -> admin, user*
// CREATE USER     -> admin, AUTOMATIC
// UPDATE USER     -> admin, user*
// DELETE USER     -> admin, user*
//
// SIGNUP          -> AUTOMATIC
// LOG IN          -> AUTOMATIC
// LOG OUT         -> AUTOMATIC


// admin
// customer
// owner, worker

// LIST RESTAURANTS   -> admin, customer
// DETAIL RESTAURANT -> admin, customer, owner
//
// LIST RESTAURANT BRANCHES -> admin, customer, owner
// DETAIL RESTAURANT BRANCH -> admin, customer, owner, worker*
//
// LIST BRANCH TABLES     -> admin, owner, worker
// DETAIL BRANCH TABLE    -> admin, owner, worker
// CREATE BRANCH TABLE    -> admin, owner
// UPDATE BRANCH TABLE    -> admin, owner
// DELETE BRANCH TABLE    -> admin, owner
//
// LIST BRANCH TURNS      -> admin, customer, owner, worker
// DETAIL BRANCH TURN     -> admin, customer, owner, worker
// CREATE BRANCH TURN     -> admin, customer, owner, worker
// DELETE BRANCH TURN     -> admin, customer*, owner, worker*
// UPDATE BRANCH TURN     -> admin, customer*, owner, worker*
//
// LIST RESTAURANT WORKERS     -> admin, owner
// DETAIL RESTAURANT WORKERS   -> admin, owner
// CREATE RESTAURANT WORKERS   -> admin, owner
// UPDATE RESTAURANT WORKERS   -> admin, owner, worker*
// DELETE RESTAURANT WORKERS   -> admin, owner
