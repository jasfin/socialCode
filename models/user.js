const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const dp_path = path.join('/uploads/users/dp');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dp:{
        type:String
    }
},{
    timestamps:true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..', dp_path));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });
   
// the below upload function is used to upload the file , ie; save the file that user sends in the form 
//   var upload = multer({ storage: storage }) 

//setting the storage config to multer and assigned to static variables for using them outside in controller like User.uploadedDp
// uploadedDp is the fn we use to save the file, by passing the request 
userSchema.statics.uploadDp = multer({ storage: storage }).single('dps'); //dps is the form-field where file is sent
userSchema.statics.pathToDp = dp_path;


const user = mongoose.model('User',userSchema);
module.exports=user;