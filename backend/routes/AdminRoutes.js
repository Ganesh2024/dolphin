const express = require('express');
const { adminCreateQues, adminGetOneQues, adminUpdateQues, adminDeleteQues, adminAuth, adminGetall, adminCreateSolution, adminDeleteSolution, adminUpdateSolution, adminGetAllSolution, adminGetOneSolution } = require('../controllers/Admin');

const router = express.Router();

router.route('/auth').post(adminAuth)
router.route('/ques').post(adminCreateQues).get(adminGetall)
router.route('/ques/:id').get(adminGetOneQues).put(adminUpdateQues).delete(adminDeleteQues)

router.route('/solution/:solutionId').put(adminUpdateSolution).get(adminGetOneSolution).delete(adminDeleteSolution)
router.route('/solution').get(adminGetAllSolution)
router.route('/solution/:quesId').post(adminCreateSolution)

module.exports =  router