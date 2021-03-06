
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	username:{type: String, lowercase: true, unique: true},
    email:{type: String, unique: true},
    verified: {type: Boolean, default: true},
    numcomments: {type: Number, default: 0},
    numposts: {type: Number, default: 0},
    accountcreated: {type: Date, default: Date.now()},
    recentactivity: {type: Date, default: Date.now()},
    location: {type: String, default: 'Unknown'},
    age: {type: Number},
    occupation: {type: String},
    userrole: {type: String, default: 'User'},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.addpost = function(cb) {
  this.numposts += 1;
  this.save(cb);
};
UserSchema.methods.addcomment = function(cb) {
  this.numcomments += 1;
  this.save(cb);
};

UserSchema.methods.generateJWT = function() {
  // set expiration to 1 day
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 1);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    userrole: this.userrole,
    exp: parseInt(exp.getTime() / 1000),
  }, '2455645364365676gdfsggfdsgs');
};


mongoose.model('User', UserSchema);