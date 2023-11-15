require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connect = require("./config/db");
const bodyParser = require("body-parser");
const questionsData = require("./temp/data")

const {login,register} = require("./controllers/Controller");
const { User } = require("./model/UserSchema");
const { Questions } = require("./model/QuesSchema");

connect(); 

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/login", login);
app.post("/register", register);  

app.post("/langselect", async (req,res)=>{ // ask to dhakad
  try {
    const {userId,lang} = req.body; // 400 invalid lang 
    console.log('test1',lang,userId);
    const user = await User.findById(userId); // 400 user not found 
    user.lang[0].langname = lang;
    user.save(); 
    console.log('test2',user);
    res.send("users lang setup completed"); // 200
  } catch (error) {
    res.send("internal server error"); // 500
  }
})

app.post('/exercise', async (req,res)=>{
  try {
    const { lang , exercise} = req.body;
    const questions = await Questions.find();
    const exerciseQuestions = questions.filter(question => (question.exercise == exercise && question.lang == lang));
    res.send({msg:"success",status:400,total:exerciseQuestions.length,exerciseQuestions});
  } catch (error) {
    res.send("internal error");
  }
})

app.post('/quesId',async (req,res)=>{
  try {
    const {userId,lang,quesId,level,type} = req.body;
    console.log({userId,lang,quesId,level,type});
    const user = await User.findById(userId);
    const langIndex = user.lang.findIndex((item)=> item.langname == lang);
    user.lang[langIndex].level = level;
    if(level){
      user.lang[langIndex].score += level;
      user.lang[langIndex].correctQues.push({quesId,type});
    }
    else{
      user.lang[langIndex].wrongQues.push({quesId,type});
    }
    await user.save();
    res.send("Success");
  } catch (error) {
    res.send("internal error");
  }

})

app.post("/reset",async (req,res)=>{
  try {
    const {userId} = req.body;
    const user = await User.findById(userId);
    user.lang=[{
      langname: null,
      score:  0 ,
      level:1,
      correctQues: [],
      wrongQues: []
    }
  ];
  await user.save();
  res.send("Success");
  } catch (error) {
    res.send("internal error");
  }
})

app.post('/user',async (req,res)=>{
  try {
    const {userId} = req.body;
    console.log({userId});
    if(!userId) return res.send({msg:"Invalid userId",status:400});
    const user = await User.findById(userId);
    console.log(user);
    if(!user) return res.send({msg:"user not found",status:400});
    res.send({msg:"success",status:200,user});
  } catch (error) {
      res.send({msg:"internal server error",status:500});
  }
})
      
app.get("/", (req, res) => {
  res.send({ status: 400, msg: "success" });
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT} 🔥`);
});
