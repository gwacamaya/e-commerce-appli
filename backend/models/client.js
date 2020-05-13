var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const bcrypt = require('bcrypt');


var ClientSchema = new Schema({
    NomClient: { type: String, required: true, index: { unique: true } },
    Password: { type: String, required: true },
    Taux_Remise: String,
    commande: [{ type: Schema.Types.ObjectId, ref: 'Commande'}]
});

ClientSchema.pre('save', function(next) 
    { 
        var user = this;
        if (!user.isModified('password')) return next();
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    });

ClientSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if (err) {
      return cb(err, false);
    }
    return cb(null, isMatch);
  });
};

module.exports = mongoose.model('Client', ClientSchema);
