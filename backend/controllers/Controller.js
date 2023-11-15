const {User} = require('../model/UserSchema')
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {isEmail} = require('validator')
// const {signupMail} = require('../utils/nodemailer')
const {isPasswordStrong} = require('../utils/passwordstrength')
const {generateSuggestedUsernames} = require('../utils/suggestusername')


const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    // checking the inputs 1. not be null or undefiled 2. must be of same type 3. should not be empty
    if(!password && !email){return res.send({msg:"invalid input",status:400})};
    if(typeof password !== 'string' && typeof email !== 'string'){return res.send({msg:"input must be a string",status:400})}
    if(password.trim().length==0 || email.trim().length==0){return res.send({msg:"all inputs are required",status:400})}
    // checking if user exist
    const user = await User.find({ email: email.toLowerCase() });
    if (user.length == 0) {return res.send({ status: 400, msg: "user not found" })}
    // decrypting the password
    const auth = await bcrypt.compare(password, user[0].password);
    if (!auth) {return res.send({ msg: "invalid credientials", status: 400 })}
    // sending response
    res.send({ msg: "login succesfully", status: 200, user: user[0] });
  } catch (error) {
    
  }
};


const register = async (req, res) => {
  try {
    const {password, email} = req.body;
    // console.log('test1');
    // checking email validation
    if(!isEmail(email)){return res.send({msg:"email is invalid",status:400})}
    // console.log('test2');
    // checking password strength
    // if(!isPasswordStrong(password)){return res.send({msg:"password is not strong should contain atleast 8 letters 1 uppercase and 1 special character"})}
    // checking if all inputs are 1.valid and of 2.same type and 3.should not be empty 
    if( !password && !email){return res.send({msg:"invalid input",status:400})};
    // console.log('test3');
    if( typeof password !== 'string' && typeof email !== 'string'){return res.send({msg:"input must be a string",status:400})}
    // console.log('test4');
    if(password.trim().length==0 || email.trim().length==0){return res.send({msg:"all inputs are required",status:400})}
    // checking for old user
    const oldUser = await User.findOne({ email: email.toLowerCase() });
    // console.log('test5');
    if (oldUser) {return res.send({ msg: "user already exist", status: 400 })}
    // console.log('test6');
    // encrypting the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    // console.log('test7');
    // creating a new user
    try {
      var newuser = await User.create({
        email: email.toLowerCase(),
        password: encryptedPassword,
        lang: [{
          langname: "",
          score:  0 ,
          level:1,
          correctQues: [],
          wrongQues: []
        }]
    });
    } catch (error) {
      console.log(error,'aaa');
    }
  // creating a jwt token
  const token = jwt.sign(
    { user_id: newuser._id, email },
    process.env.TOKEN_KEY,
    { expiresIn: "15d" }
    );
    newuser.token = token;
    await newuser.save();
    console.log('test9');
    res.send({ msg: "user created", status: 200, user: newuser });
  } catch (error) {
      console.log(error)
      res.send({msg:"internal server error",status:500,error})
  }
};



module.exports = {
  login,
  register,
};
