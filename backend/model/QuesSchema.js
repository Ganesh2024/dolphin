const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    exercise: {type:String,required:true},
    lang:{type:String,required:true}, 
    desc: { type: String, required: true },
    options: [{ type: String, required: true }],
    corrAns: { type: String, required: true },
    level: { type: Number, required: true },
}); 
  
    
const Questions = mongoose.model("Questions", QuestionSchema);
  
module.exports = {
    Questions,
};