var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var userSchema = new Schema({
  username: String,
  password: String,
  personname: String,
  score: Number
});
 
module.exports = mongoose.model('users', userSchema);
