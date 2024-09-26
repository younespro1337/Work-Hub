const express = require('express');
const {
  loginUser,
  getAllUsers,
  approveRequest,
  rejectRequest,
  confirmTaken,
  search,
  addJobs,
  getAllJobs,
  applyJob,
  getAllMaterialRequester,
  deleteUser,
  deleteJob,
  isHaveARequests,
  updateProfileImg,
  createTasks,
  TasksAvailable,
  updatedTask,
  NewMemberMarketingB2B,
  fetchTasks,
  updatedTaskDone,
  editWorker,
  editJobs,
  forgotPassword,
  sendMessages,
  getAllChats,
  registerWorker,
  googleLogin,
  resetPassword,

} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate Limiting
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.'
});

router.post('/register', registerWorker);
router.post('/login', defaultLimiter,  loginUser);
router.post('/oauth/google', googleLogin);
router.post('/resetPassword/:token', defaultLimiter,resetPassword);
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.post('/approve', approveRequest);
router.post('/reject', rejectRequest);
router.post('/confirm', confirmTaken)
router.get('/search', isAuthenticatedUser ,search)
router.post('/admin/addJobs', addJobs);
router.get('/jobs', getAllJobs);
router.post('/applyJob',isAuthenticatedUser, applyJob);
router.get('/materialrequesters', getAllMaterialRequester);
router.get('/workers', getAllUsers);
router.delete('/users/:id', deleteUser);
router.delete('/job/:id', deleteJob);
router.post('/getRequests', isHaveARequests);
router.post('/updateprofileimg',updateProfileImg);
router.post('/tasks', createTasks);
router.get('/fetchTasks', fetchTasks); 
router.post('/TasksAvailable', TasksAvailable);
router.post('/updateTasks', updatedTask);
router.post('/NewMemberMarketingB2B', NewMemberMarketingB2B);
router.post('/editworker', editWorker);
router.post('/editJobs', editJobs);
router.post('/forgotPassword', forgotPassword);
router.post('/send-messages', sendMessages);
router.get('/getAllChats', getAllChats);
module.exports = router;
