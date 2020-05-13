var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    prixHT:{type:Number,required:true},
    nom:{type:String,required:true},
    depot: {type: Schema.Types.ObjectId, ref:'Depot', required: true}
   
});

module.exports = mongoose.model('Article', ArticleSchema);