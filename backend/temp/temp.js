
// GETTING THE QUESTIONS FROM ONLINE DB TO LOCAL DB


// app.get('/getQues',async (req,res)=>{
    
//     const topicArr = ["sets","relation","function","probability","triangle","mensuration","circle","permutaion and combination"]
//     const ques = await Questions.find({});
//     var newdata = [];
//     ques.map((item)=>{
//       const randomIndex = Math.floor(Math.random() * topicArr.length);
//       const randomElement = topicArr[randomIndex];
//       const {desc,options,corrAns,level,type,likes,difficulty,dislikes,isReviewed,submissions} = item
//       const newObj = {submissions,likes,dislikes,level,desc,options,corrAns,topic:randomElement,difficulty,isReviewed}
//       newdata.push(newObj)
//     })
//     const csv = new ObjectsToCsv(newdata);
//     await csv.toDisk('./text3.csv');
//     res.send({msg:"success",data:newdata});
//   })


//---- FOR CREATING ADMIN USER ----//
// app.post('/adminAuth' , async (req,res)=>{
//   const {email,password} = req.body;
//   console.log({email,password});
//   const encryptedPassword = await bcrypt.hash(password,10);
//   const user = await admin.create({
//     email:email.toLowerCase(),
//     password:encryptedPassword,
//     token:'',
//   })
//   console.log(user);
//   const token = jwt.sign(
//     {user_id: user._id, email},
//     process.env.TOKEN_KEY,
//     {expiresIn: "15d",}
//   )
//   console.log({token});
//   user.token = token;
//   await user.save();
//   res.send({msg:'success',user})
// })

