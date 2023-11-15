const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, sparse: true },
    password: { type: String, required: true,},
    token: { type: String },
    lang: [
      { 
        langname: { type: String},
        level:{type:Number},
        score: { type: Number },
        correctQues: [{quesId:{ type: String  },type:{type:String}}],
        wrongQues: [{quesId:{ type: String  },type:{type:String}}],
      }
    ]
  },
  { timestamps: true }
);


const User = mongoose.model("User", UserSchema);

module.exports = { User };