const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    name : { type : String , required : true },
    email : { type : String , unique : true  ,required : true},
    password : { type : String ,  required : true },
} , { timestamps : true });
userSchema.statics.hashPassword = function(password) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password , salt);
    return hash;
}
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password , this.password);
}
module.exports = mongoose.model('User' , userSchema);