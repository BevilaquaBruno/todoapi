const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const AuthorSchema = mongoose.Schema({
	name: { type: String, required: true },
  birthday: { type: Date, default: null },
  description: { type: String , default: 'No Description' },
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  token: { type: String, default: 'no token' }
}, {
	timestamps: true
});

AuthorSchema.pre('save', function(next) {
  var author = this;

  // only hash the password if it has been modified (or is new)
  if (!author.isModified('password')){
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err){
        return next(err);
      }

      // hash the password using our new salt
      bcrypt.hash(author.password, salt, function(err, hash) {
          if (err){
            return next(err);
          }

          // override the cleartext password with the hashed one
          author.password = hash;
          next();
      });
  });
});

AuthorSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};

module.exports = mongoose.model('Author', AuthorSchema);