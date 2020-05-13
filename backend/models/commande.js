var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommandeSchema = new Schema({
    numcommande: String,
    datecommande: String,
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    articles: [],
    total: {type: Number}

});

module.exports = mongoose.model('Commande', CommandeSchema);