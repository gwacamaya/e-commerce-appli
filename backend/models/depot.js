var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var depotSchema = new Schema({
    name: { type: String, required: true},
    articleStock: [{
        articleId: {type: Schema.Types.ObjectId, ref: 'Article', required: true},
        qty: {type: Number, min: 0}
    }]
});

module.exports = mongoose.model('Depot', depotSchema);