const bcrypt = require("bcryptjs");
const { Questions , Solutions } = require("../model/QuesSchema");
const { admin } = require("../model/AdminSchema");

//*************** ADMIN APIS ****************//
const adminCreateQues = async (req, res) => {
  console.log("crate");
  try {
    const {desc,corrAns,level,topic,difficulty,isReviewed,options} = req.body;
    // creating question
    const ques = await Questions.create({desc,options,corrAns,level,topic,difficulty,isReviewed,
    });
    // sending response
    res.status(200).send({ msg: "question created", status: 200 });
    // handling error
  } catch (error) {
    console.log(error);
    res.send({ msg: "internal server error", status: 500 });
  }
};

const adminDeleteQues = async (req, res) => {
  try {
    const quesId = req.params.id;
    // checking valid quesId
    if (!quesId) {return res.send({ msg: "invalid question id", status: 400 });}
    // deleting question
    await Questions.deleteOne({ _id: req.params.id });
    // sending response
    res.status(200).send({ msg: "deleted", status: 200 });
  } catch (error) {
    res.status(500).send({ msg: "internal server error", status: 500 });
  }
};

const adminUpdateQues = async (req, res) => {
  try {
    const Ques = req.body;
    const quesId = req.params.id;
    if (!quesId) {return res.send({ msg: "invalid quesId", status: 400 });}
    const updatedQues = await Questions.findByIdAndUpdate(quesId, Ques, {new: true});
    res.status(200).send(updatedQues);
  } catch (error) {res.send({ msg: "internal server error", status: 500 })}
};

const adminGetOneQues = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {return res.status(400).send({ msg: "invalid quesId" });}
    const question = await Questions.findById(id);
    res.send(question);
  } catch (error) {res.status(500).send({ msg: "internal server error" });}
};

const adminGetall = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page number (default: 1)
    const perPage = parseInt(req.query.perPage) || 10; // Get the number of questions per page (default: 10)
    console.log({page,perPage});
    // Calculate the skip value to determine which subset of questions to fetch
    const skip = (page - 1) * perPage;
    // Fetch the paginated questions from the database using the skip and limit parameters
    const questions = await Questions.find().skip(skip).limit(perPage);
    // Get the total count of questions in the database
    const totalQuestions = await Questions.countDocuments();
    res.status(200).send({
      totalQuestions,
      currentPage: page,
      data:questions,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const adminAuth = async (req, res) => {
  try {
    const { email, password } = req.body;
    // checking valid email and password
    if (!email || !password) {
      return res.send({ msg: "email or password is not defined", status: 400 });
    }
    // getting the user
    const user = await admin.find({ email: email.toLowerCase() });
    // if user not found return
    if (user.length == 0) {
      return res.send({ status: 400, msg: "user not found" });
    }
    // authenticating
    const auth = await bcrypt.compare(password, user[0].password);
    if (!auth) {
      return res.send({ msg: "invalid credientials", status: 400 });
    }
    // sending  response
    res.send({ msg: "login succesfully", status: 200, user: user[0] });
  } catch (error) {
    res.send({ msg: "internal server error", status: 500 });
  }
};

//************** SOLUTION'S API **************//
const adminCreateSolution = async (req,res)=> {
  console.log('ggg');
  try {
    // checking for valid ques Id
    const {quesId} = req.params;
    if(!quesId){return res.send({msg:"invalid quesId",status:400})}
    // getting the txt or img solution
    const {txt_sol,img_sol} = req.body;
    console.log({txt_sol,img_sol,quesId});
    // creating new solution
    const new_solution = await Solutions.create({quesId,txt_sol,img_sol});
    console.log(new_solution,'ssss');
    // adding solution id to that question 
    const ques = await Questions.findById({_id:quesId});
    console.log(ques,'qqqq');
    ques.solution = new_solution._id;
    console.log(ques.solution,'llll');
    ques.save();
    // sending response 
    res.send({msg:"solution created",status:200});
  } catch (error) {
    // handling error
    res.send({msg:"internal server error",status:500});
  }
}

const adminUpdateSolution = async (req,res)=> {
  try {
    const {solutionId} = req.params;
    // checking valid quesId
    if(!solutionId){return res.send({msg:"invalid quesId",status:400})}
    // getting the updated fields
    const {txt_sol,img_sol} = req.body;
    // if txt_sol empty then return 
    if(!txt_sol){return res.send({msg:"empty solution cannot be posted",status:400})}
    // updating the solution 
    const updatedSolution = await Solutions.findByIdAndUpdate(solutionId, req.body , {new: true});
    if(!updatedSolution){return res.send({msg:"solution not found",status:400})}
    // sending respomnse 
    res.status(200).send(updatedSolution);
  } catch (error) {
    // hamdling error
    res.send({msg:"internal server error",status:500})
  }
}

const adminDeleteSolution = async (req,res)=> {
  try {
    const {solutionId} = req.params;
    console.log({solutionId});
    // checking valid quesId and solutionId
    if(!solutionId){return res.send({msg:"invalid solutionId",statur:400})}
    const solution = await Solutions.findById(solutionId);
    // findding the question
    const ques = await Questions.findById({_id:solution.quesId});
    // // if not found then return 
    if(!ques){return req.send({msg:"question not found",status:400})};
    // // else setting solution to null and saving
    ques.solution = null;
    ques.save();
    // // deleting solution from solution collection
    const deleted_sol = await Solutions.findByIdAndDelete(solutionId);
    // if solution not found 
    if(!deleted_sol){return res.send({msg:"solution not found",status:400})}
    // // sending response
    res.send({msg:"successfully deleted",status:400})
  } catch (error) {
    res.send({msg:"internal server error",status:500})
  }
}

const adminGetAllSolution = async (req,res)=> {
  console.log('getall')
  try {
    const page = parseInt(req.query.page) || 1; // Get the requested page number (default: 1)
    const perPage = parseInt(req.query.perPage) || 10; // Get the number of questions per page (default: 10)
    // Calculate the skip value to determine which subset of questions to fetch
    const skip = (page - 1) * perPage;
    // Fetch the paginated questions from the database using the skip and limit parameters
    const solutions = await Solutions.find().skip(skip).limit(perPage);
    // Get the total count of questions in the database
    const totalSolutions = await Solutions.countDocuments();
    res.status(200).send({
      totalSolutions,
      currentPage: page,
      data:solutions,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

const adminGetOneSolution = async (req,res)=> {
  try {
    const { solutionId } = req.params;
    if (!solutionId) {return res.status(400).send({ msg: "invalid solutionId" });}
    const solution = await Solutions.findById(solutionId);
    res.send(solution);
  } catch (error) {res.status(500).send({ msg: "internal server error" });}
}

module.exports = {
  adminAuth,
  adminDeleteQues,
  adminUpdateQues,
  adminGetOneQues,
  adminCreateQues,
  adminGetall,

  adminCreateSolution,
  adminUpdateSolution,
  adminDeleteSolution,
  adminGetAllSolution,
  adminGetOneSolution
};
