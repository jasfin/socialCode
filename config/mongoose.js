const mongoose = require('mongoose');
const properties = require('./properties');
mongoose.connect(`mongodb://localhost/${properties.db_name}`, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to mongoDB'));
db.once('open', function() {
  console.log('Connected to mongoDB successfully');
});

module.exports=db;

//if mongo is not running on port 27017, start if from taskmanager:
// Open task manager.
// click on the services tab.
// Search for MongoDB service.
// After selecting click on the 'view services' tab.
// Search for MongoDB server.
// After Selecting click on the Run button on the top left side menu.