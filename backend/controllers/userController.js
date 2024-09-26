const Workers = require('../models/workersModel');
const Materials = require('../models/productModel');
const Jobs = require('../models/jobsModel');
const EmailLog = require('../models/emailModel')
const Tasks = require('../models/taskModel')
const MarketerModel = require('../models/MarketerModel'); 
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const cloudinary = require('cloudinary').v2; 
const sendToken = require('../utils/sendToken');
const MaterialRequest = require('../models/MaterialRequestModel');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require('fs');
const Chats = require('../models/chatModel');
const axios = require('axios'); 
const  { validate } = require('deep-email-validator') ;
const ErrorHandler = require("../utils/errorHandler");
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


async function generateUniqueNationalId() {
    try {
        let isUnique = false;
        let nextNationalId;

        while (!isUnique) {
            // Generate a new unique nationalID
            nextNationalId = generateRandomNationalId(6); // Generate a 6-digit random nationalId

            // Check if the generated nationalID already exists
            const existingWorker = await Workers.findOne({ nationalId: nextNationalId });

            if (!existingWorker) {
                isUnique = true; // Exit the loop if the nationalID is unique
            }
        }

        return nextNationalId; // Return the unique nationalID
    } catch (error) {
        console.error("Error generating unique nationalID:", error);
        throw error;
    }
}

function generateRandomNationalId(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

exports.googleLogin = asyncErrorHandler(async (req, res, next) => {

  const { userData } = req.body; 

  const { email, given_name: firstName, family_name: lastName, picture } = userData;

  try {
    // Check if the user already exists
    let user = await Workers.findOne({ email });
    

    if (!user) {
      user = await Workers.create({
        firstName,
        lastName,
        email,
        password: crypto.randomBytes(10).toString('hex'), 
        avatar: {
          public_id: 'N/A' , url: picture || 'https://cdnassets.hw.net/eb/31/777a1d784ee2a38d9a739146266d/adobestock-262235652-web.jpg',  // Fallback to default picture
        },
      });
    
      // console.log('New OAuth user created:', user);
    }
    
    // Generate JWT token for the user (existing or newly created)
    const token = user.generateToken();
    
    // Send the token and user data back to the client
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Error during Google login:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during Google login',
    });
  }
});



exports.registerWorker = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.body);
  const { 
      firstName, 
      lastName, 
      email, 
      password, 
      position, 
      salary, 
      gender, 
      nationalId, 
      phoneNumber, 
      legalInfo, 
      avatar: { publicId, url } 
  } = req.body;

  try {
      let user;

      // Validate email format
      let validationResult = await validate({
          email: email,
          sender: 'raymondyounes2@gmail.com',
          validateRegex: true,
          validateMx: false,
          validateTypo: false,
          validateDisposable: false,
          validateSMTP: false,
      });

      // console.log('full validationResult:', validationResult);

      if (!validationResult.valid) {
          throw new ErrorHandler('Invalid email format, please provide a valid email address', 400);
      }

      // Check if email is already in use
      const existingUser = await Workers.findOne({ email });
if (existingUser) {
  console.log(existingUser)
    return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please use a different email or log in.'
    });
}


      if (firstName && lastName && email && password && position && salary && gender && nationalId && phoneNumber && legalInfo) {
        // console.log('im here:');
          user = await Workers.create({
              firstName,
              lastName,
              email,
              password,
              position,
              salary,
              gender,
              nationalId,
              phoneNumber,
              legalInfo,
              avatar: { public_id: publicId, url: url },
              role: 'user',
              receiveUpdates: true,
          });
          const AllUsers = await Workers.find()
          res.status(201).json({
            success: true,
            message: "Worker created successfully",
            data: AllUsers,
          });
          
          // sendToken(user, 201, res);
          
      } else if (firstName && lastName && email && password) {
          user = await Workers.create({
              firstName,
              lastName,
              email,
              password,
              role: 'unknown',
              receiveUpdates: true,
          });
          
          sendToken(user, 201, res);
          
      } else {
          throw new Error('Incomplete data');
      }

  } catch (error) {
      console.error(error);
      next(error); 
  }
});




exports.loginUser = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body.email; // Expecting body to contain email and password
  console.log('Login attempt with email:', email); // Logging the email used for login

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter email and password' });
  }

  // Find user by email and include the hashed password for comparison
  const user = await Workers.findOne({ email }).select('+password');
  console.log('User retrieved:', user); // Logging user object

  // Check if user exists
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare provided password with stored hashed password
  const isPasswordMatched = await user.comparePassword(password);
  console.log('Is password matched:', isPasswordMatched); // Logging comparison result

  // Handle password mismatch
  if (!isPasswordMatched) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate token for the user
  const token = user.generateToken();
  
  const responseData = {
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: {
        url: user.avatar.url,
        public_id: user.avatar.public_id,
      },
    },
  };

  // Send response
  return res.status(200).json(responseData);
});



exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const user = await Workers.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No user with that email found.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
        const html = `Click this link to reset your password: ${resetURL}`;
        
        const data = {
          email: email,
          html: html,
          subject: 'Password Reset',
        };

        await sendEmail(data);
        res.status(200).json({ success: true, message: 'Password reset link sent.' });
    } catch (error) {
        console.error('Error while processing forgotPassword:', error);
        res.status(500).json({ success: false, message: 'Error while sending reset link.' });
    }
};



exports.resetPassword = async (req, res) => {
  const { token } = req.params; // Get the token from the request parameters
  const { password } = req.body; // Get the new password from the request body

  // console.debug('Received reset request with token:', token);
  // console.debug('New password attempt:', password);

  try {


  const user = await Workers.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
    

    if (!user) {
      console.warn('Invalid or expired reset token for token:', token);
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    
    
    // console.debug('User password updated successfully.' );
    res.status(200).json({ 
      message: 'Password has been reset successfully',
     });

  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
};








// Your route handler
exports.Track = async (req, res) => {
  console.log('req Query: ', req.query);
  
  try {
    // Retrieve the client's IP address from the request object
    const ipAddress = req.ip;

    // Construct the URL for the IP geolocation service using your API key
    const myApiKey = '6c105f5d9e926dc7f86df2da63b2e5f3';
    const url = `http://api.ipstack.com/${ipAddress}?access_key=${myApiKey}`;

    // Fetch additional details about the client's IP address
    const response = await axios.get(url);
    // Log or store the response data
    console.log("IP Geolocation Response: ", response.data);
     
    // its email adress not id , id is generates from mongodb by default
    const { id } = req.query;

    // Create a new instance of the EmailLog model
    const emailLogEntry = new EmailLog({
      id,
      ipAddress,
      geolocation: response.data,
    });

    // Save the entry to the database
    await emailLogEntry.save();

    // Respond with a success message
    res.status(200).json({ success: true, message: 'ID logged successfully' });
  } catch (error) {
    console.error(error);
    // Handle other errors and send an appropriate response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.sendMessages = async (req, res) => {
  console.log('req Body:', req.body);

  try {
    const { participants, messages } = req.body;
    const senderWorker = await Workers.findById(messages[0].sender); // Assuming the first message sender is the participant
    const receiverWorker = await Workers.findById(participants.find(participant => participant !== messages[0].sender));

    const senderAvatarUrl = senderWorker?.avatar?.url || '';
    const receiverAvatarUrl = receiverWorker?.avatar?.url || '';

    const existingChat = await Chats.findOne({ participants });
    let updatedChat;

    if (existingChat) {
      await Chats.findByIdAndUpdate(existingChat._id, {
        $push: {
          messages: messages.map((message) => {
            const content = {
              type: message.content.type,
              ...(message.content.type === 'text' ? { data: message.content.data } : { media: message.content.data }),
            };

            return {
              sender: message.sender,
              content,
              timestamp: message.timestamp,
              avatars: {
                senderAvatar: senderAvatarUrl,
                otherAvatar: receiverAvatarUrl,
              },
            };
          }),
        },
      });

      updatedChat = await Chats.findById(existingChat._id);
    } else {
      const newChat = await Chats.create({
        participants,
        messages: messages.map((message) => {
          const content = {
            type: message.content.type,
            ...(message.content.type === 'text' ? { data: message.content.data } : { media: message.content.data }),
          };

          return {
            sender: message.sender,
            content,
            timestamp: message.timestamp,
            avatars: {
              senderAvatar: senderAvatarUrl,
              otherAvatar: receiverAvatarUrl,
            },
          };
        }),
      });
      updatedChat = newChat;

      io.to(participants.join('-')).emit('joinChat', participants);

      await updateWorkerChats(senderWorker, updatedChat._id);
      await updateWorkerChats(receiverWorker, updatedChat._id);
    }

    io.to(updatedChat._id).emit('message', {
      message: messages,
      sender: senderWorker._id,
    });

    res.status(200).json({ chat: updatedChat });
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const updateWorkerChats = async (worker, chatId) => {
  const hasChat = worker.chats.some((chat) => chat.chatId.toString() === chatId.toString());

  if (!hasChat) {
    await Workers.findByIdAndUpdate(
      worker._id,
      {
        $push: {
          chats: {
            chatId,
            type: 'private',
          },
        },
      },
      { new: true }
    );
  }
};
  



exports.getAllChats = async (req, res) => {
  console.log(req.query)
  
  try {
    const { selectedMember, userId } = req.query;

    // Assuming Chats model has a participants field as an array of ObjectId
    const allChats = await Chats.find({
      participants: { $all: [selectedMember, userId] }
    });

    const memberDetails = await Workers.findById(selectedMember);
    console.log(memberDetails)
    res.status(200).json({ chats: allChats,memberDetails: memberDetails  });
  } catch (error) {
    console.error('Error retrieving chats:', error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};







getMaterialsRequetsOfUsers = async (userId) => {

  try {
    const updatedRequestData = {
      user: {
_id: userId,
      },
requests: [], 
    };

    const materialRequests = await MaterialRequest.find({
      $or: [
        { requesterId: userId },
        { userId_of_Taken: userId },
      ],
    }).populate({
      path: 'materialId',
      select: 'name', 
    }).populate('userId_of_Taken');

    materialRequests.forEach((request) => {
      let requestData = {
        materialId: request.materialId._id,
        materialName: request.materialId.name,
        requesterName: request.requesterName,
        requesterAvatar: request.requesterAvatar,
        destination: request.requesterDestination,
        materialPicture: request.materialPicture,
        requesterId: request.requesterId,
        requestId: request._id,
        requestDate: request.requestDate,
        status: request.status,
        message: '',
      };

      if (request.requesterId.toString() === userId.toString()) {
        if (request.status === 'pending') {
          requestData.message = `Your request is pending. Please wait for approval.`;
        } else if (request.status === 'approved') {
          requestData.message = `Your material request from ${request.requesterName} has been approved. Please confirm if you have physically taken the material.`;
} else if (request.status === 'rejected') {
requestData.message = `Your request from ${request.requesterName} has been rejected. Please try again later.`;
        }
      } else if (request.userId_of_Taken._id.toString() === userId.toString() && request.status === 'pending') {
        requestData.message = `You have a material that ${request.requesterName} needs. Please approve or reject the request.`;
      }
     
      updatedRequestData.requests.push(requestData);
    });
  
    return updatedRequestData
  } catch (error) {
    console.error('Error fetching material requests:', error);
  }
};


exports.isHaveARequests = asyncErrorHandler(async (req, res) => {
  // console.log(req.body)
  const { userId } = req.body
const updatedRequestData = await  getMaterialsRequetsOfUsers(userId) 
res.status(200).json({ requestData: updatedRequestData });

})










exports.approveRequest = asyncErrorHandler(async (req, res) => {
  const { requestId } = req.body;
  // console.log('approved', requestId);

  try {
    const updatedRequest = await MaterialRequest.findOneAndUpdate(
      { _id: requestId, status: 'pending' }, 
      { status: 'approved' }, 
      { new: true } 
    );

    //  console.log('updatedRequest:', updatedRequest)
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found or already approved.' });
    }

    
res.status(200).json({ message: 'Request approved successfully.', updatedRequest });
    
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



exports.rejectRequest = asyncErrorHandler(async (req, res) => {
    // console.log('rejected', req.body)
    const { user, status } = req.body;
    await MaterialRequest.findOneAndUpdate(
      { userId_of_taken: user._id },
      { status },
      { new: true }
    );  
    res.status(200).json({ message: 'Request rejected' });
});


exports.confirmTaken = asyncErrorHandler(async (req, res) => {
  // console.log(req.body);
  // console.log(req.body.approvedRequests[0].userOfTaken);
  const requestId = req.body.approvedRequests[0].requestId;
  const requesterId = req.body.approvedRequests[0].requesterId;

  // Find the material request by its requestId
  const materialRequest = await MaterialRequest.findOne({ requestId });

  if (!materialRequest) {
    return res.status(404).json({ message: 'Material request not found' });
  }

  // Update the userIdLS in the material's users array with the requesterId
  const materialId = materialRequest.materialId;
  const material = await Materials.findById(materialId);

  if (!material) {
    return res.status(404).json({ message: 'Material not found' });
  }

  const userOfTakenId = req.body.approvedRequests[0].userOfTaken._id;

  // Update the user in the material's users array
  for (const user of material.users) {
    if (user.userIdLS.toString() === userOfTakenId.toString()) { // Compare the user's userIdLS with the userOfTakenId
      // console.log('User IDLS matched:', user._id);
      user.userIdLS = requesterId;
      // Find the worker by the requesterId
      try {
        const worker = await Workers.findById(requesterId);
        if (worker) {
          user.email = worker.email;       // Update email from worker
          user.name = worker.name;         // Update name from worker
          user.takenAt = Date.now();       // Update takenAt with the current date
        } else {
          // console.log(`Worker with ID ${requesterId} not found.`);
          // Handle the case when worker is not found, e.g., show an error message or take appropriate action.
        }
      } catch (error) {
        console.error('Error while finding the worker:', error);
        // Handle the error if needed, e.g., show an error message or take appropriate action.
      }
    }
  }

  // Save the updated material
  await material.save();

  // Remove the material request document from the database
  await MaterialRequest.findOneAndRemove({ requestId });

  console.log(`Material request with requestId ${requestId} removed from the database.`);
  res.status(200).json({ message: 'Material request confirmed successfully' });
});





exports.search = async (req, res) => {
  const { keyword } = req.query;
  try {
    // Search in Users collection
    const users = await Workers.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } }
      ]
    });

    // Search in Materials collection
    const materials = await Materials.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    });

    // Search in Jobs collection
    const jobs = await Jobs.find({
      $or: [
        { jobTitle: { $regex: keyword, $options: 'i' } },
        { jobDescription: { $regex: keyword, $options: 'i' } }
      ]
    });

    res.status(200).json({ success: true, users, materials, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};




exports.addJobs = asyncErrorHandler(async (req, res) => {
  try {
    const { title, description, requirements, salary, email, phone } = req.body;

    // Create a new job document
    const newJob = await Jobs.create({
      title,
      description,
      requirements,
      salary,
      applicationDetails: {
        email,
        phone
      }
    });

    // Fetch all jobs after adding a new job
    const allJobs = await Jobs.find();

    // Send a success response with all jobs
    res.status(200).json({ success: true, jobs: allJobs });
  } catch (error) {
    // Handle any errors
    console.error("Error creating job:", error);
    res.status(500).json({ success: false, error: "Failed to create job" });
  }
});


exports.getAllJobs = asyncErrorHandler(async (req, res) => {
  console.log(req.body);
  try {
    const jobs = await Jobs.find();
    if (!jobs) {
      return res.status(404).json({
        success: false,
        message: 'No jobs found',
      });
    }
    // Process the fetched jobs or return a response
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    // Handle the error
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
    });
  }
});

exports.applyJob = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.body);
  // console.log(req.files);
  try {
    const { jobId, name, email, message } = req.body;
    const file = req.files.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file found in the request' });
    }

    // Convert the file data to base64 encoding
    const fileData = file.data.toString('base64');

    // Upload the base64-encoded file to Cloudinary
    const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${fileData}`, {
      folder: 'applicants',
      resource_type: 'auto'
    });

    // Get the secure URL of the uploaded file
    const fileUrl = result.secure_url;

    // Find the job post by its ID
    const jobPost = await Jobs.findById(jobId);

    if (!jobPost) {
      return res.status(404).json({ success: false, message: 'Job post not found' });
    }
    jobPost.counter += 1; 
    // Push the new applicant's information to the applicants array
    jobPost.applicants.push({ name, email, file: fileUrl, message });

    // Save the updated job post
    await jobPost.save();

    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await Workers.find();

  // Create a new array without the 'nationalId' field
  const usersWithoutNationalId = users.map(user => {
    const { nationalId, ...userWithoutNationalId } = user.toObject(); // Remove 'nationalId' from the user object
    return userWithoutNationalId;
  });

  res.status(200).json({
    success: true,
    users: usersWithoutNationalId,
  });
});


exports.getAllMaterialRequester = asyncErrorHandler(async (req, res) => {
  const materialRequesters = await MaterialRequest.find();
  res.status(200).json(materialRequesters);
});



exports.deleteUser = asyncErrorHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const worker = await Workers.findByIdAndRemove(id);
    const users = await Workers.find();
    res.status(200).json({ success: true, message: 'User deleted successfully', users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to delete user' });
  }
});


exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Jobs.findByIdAndRemove(id);
    const jobs = await Jobs.find();
    res.status(200).json({ success: true, message: 'Job deleted successfully', jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to delete job' });
  }
};



exports.updateProfileImg = asyncErrorHandler(async (req, res) => {
  const { userId, imageData } = req.body;

  // Extracting required fields from imageData
  const { public_id, secure_url } = imageData;

  try {
    // Find the worker by userId and update the avatar property
    const worker = await Workers.findOneAndUpdate(
      { _id: userId },
      { 
        'avatar.public_id': public_id,
        'avatar.url': secure_url 
      },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    return res.status(200).json({ message: 'Image uploaded successfully', worker });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Image upload failed', error });
  }
});










exports.createTasks = asyncErrorHandler(async (req, res) => {
  console.log('create Tasks:', req.body);
  const { 
    title, 
    description, 
    resultExpectation, 
    deadlineDays, 
    workersId, 
    mediaUrls,
    adminOfTaskId
  } = req.body;

  try {
    // Validate workers
    const workers = await Workers.find({ _id: { $in: workersId } });
    if (workers.length !== workersId.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid worker IDs',
      });
    }

    const adminWorker = await Workers.findOne({ role: 'admin' });
    const adminOfCollectionId = adminWorker._id;

    const worker = workers.find(w => w._id.toString() === workersId[0]);

    const firstName = worker ? worker.firstName : '';
    const lastName = worker ? worker.lastName : '';
    const adminAvatar = adminWorker.avatar?.url || '';

    // Prepare images, videos, and documents data
    const images = mediaUrls.taskImages.map(url => ({ url }));
    const videos = mediaUrls.taskVideos.map(url => ({ url }));
    const documents = mediaUrls.taskDocuments.map(url => ({ url }));

    // Determine the assignmentType based on the number of workers
    const assignmentType = workersId.length > 1 ? 'group' : 'individual';

    // Determine the admin based on the number of workers
    const admin = workersId.length === 1 ? adminOfTaskId || adminOfCollectionId : adminOfCollectionId;

    // Create a new task
    const newTask = new Tasks({
      title,
      description,
      expectation: resultExpectation,
      deadlineDays,
      assignmentType,
      worker: workersId,
      firstName,
      lastName,
      admin,
      adminAvatar,
      images,
      videos,
      documents
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: savedTask,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    const errors = {};

    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating task',
      errors,
    });
  }
});

















exports.TasksAvailable = asyncErrorHandler(async (req, res) => {
  console.log(req.body);
  const { id } = req.body;

  try {
    const tasks = await Tasks.find({ worker: id });
    
    // Extracting the worker IDs from the tasks
    const workerIds = tasks && tasks.length ? tasks[0].worker : [];
    
    // Finding the workers based on the worker IDs
    const WorkersTeamMembers = await Workers.find({ _id: { $in: workerIds } });
    
    res.status(200).json({
      workersData: WorkersTeamMembers,
      success: true,
      tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message,
    });
  }
});













exports.fetchTasks = asyncErrorHandler(async (req, res) => {

  try {
    const tasks = await Tasks.find();
    console.log(tasks)
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error fetching tasks' });
  }
});













exports.updatedTask = asyncErrorHandler(async (req, res) => {
  console.log('req body updatedTask:', req.body);
  const { taskId, userId , action } = req.body;
  try {
    const task = await Tasks.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (action === 'Delete') {
      await Tasks.findByIdAndUpdate(
        taskId,
        { $pull: { worker: userId } }, // Remove userId from the worker array
        { new: true }
      );

      // Query tasks related to the worker
      const tasks = await Tasks.find({ worker: userId });
      return res.status(200).json(tasks);
    } else {
      let newStatus;

      switch (task.status) {
        case 'pending':
          newStatus = 'in progress';
          break;
        case 'in progress':
          newStatus = 'completed';
          break;
        default:
          newStatus = task.status;
      }

      await Tasks.findByIdAndUpdate(
        taskId,
        { $set: { status: newStatus } },
        { new: true }
      );

      // Query tasks related to the worker
      const tasks = await Tasks.find({ worker: userId });
      return res.status(200).json(tasks);
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    return res.status(500).json({ message: 'Error updating task status' });
  }
});












exports.NewMemberMarketingB2B = asyncErrorHandler(async (req, res) => {
  console.log(req.body)
  // Get the data from the request body
  const {
    fullName,
    email,
    phone,
    experience,
    portfolio,
    b2bExpertise,
    additionalQuestion
  } = req.body;

  // Create a new instance of the MarketerModel
  const newMarketer = new MarketerModel({
    fullName,
    email,
    phone,
    experience,
    portfolio,
    b2bExpertise,
    additionalQuestion
  });

  try {
    const savedMarketer = await newMarketer.save();
    // console.log('Data saved successfully:', savedMarketer);
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    // Send an error response to the client
    res.status(500).json({ error: 'An error occurred while saving data' });
  }
});

exports.editWorker = asyncErrorHandler(async (req, res) => {
  console.log(req.body)

  // Destructure the request body
  const { id, field, value } = req.body;


  try {
    // Find the worker by ID
    const worker = await Workers.findById(id);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (!worker[field]) {
      return res.status(400).json({message: `Field ${field} does not exist in the workers model`})
    }
    // Update the specified field with the new value
    worker[field] = value;

    // Save the updated worker to the database
    await worker.save();

    // console.log('Worker updated:', worker);

    // Send a success response
    return res.status(200).json({ message: 'Worker updated successfully', worker });
  } catch (error) {
    console.error('Error updating worker:', error);

    // Send an error response
    return res.status(500).json({ message: 'Error updating worker', error });
  }
})


exports.editJobs = asyncErrorHandler(async (req, res) => {
  console.log(req.body)

  // Destructure the request body
  const { id, field, value } = req.body;

  try {
    // Find the worker by ID
    const jobs = await Jobs.findById(id);

    if (!jobs) {
      return res.status(404).json({ message: 'Worker not found' });
    }


    if (!jobs[field]) {
      return res.status(400).json({message: `Field ${field} does not exist in the workers model`})
    }
    // Update the specified field with the new value
    jobs[field] = value;

    // Save the updated worker to the database
    await jobs.save();

    console.log('Worker updated:', jobs);

    // Send a success response
    return res.status(200).json({ message: 'Worker updated successfully', jobs });
  } catch (error) {
    console.error('Error updating worker:', error);

    // Send an error response
    return res.status(500).json({ message: 'Error updating worker', error });
  }
});;













