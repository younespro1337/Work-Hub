const Material = require('../models/productModel');
const Workers = require('../models/workersModel');
const MaterialRequest = require('../models/MaterialRequestModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const axios = require('axios');
// Create an HTTP server
const { Server } = require('socket.io');
const http = require('http');
const app = require('../app.js');
const { timeStamp } = require('console');
const server = http.createServer(app);
const io = new Server(server);
const  { validate } = require('deep-email-validator') ;
const ErrorHandler = require("../utils/errorHandler");


// Create material ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body);
  const { name, description, stock, image, category, publicId } = req.body;
  try {
    const material = await Material.create({
      name: name,
      description,
      stock,
      images: {
        public_id: publicId,
        url: image
      },
      category
    });

    // Fetch all materials after creating a new one
    const allMaterials = await Material.find();

    res.status(201).json({
      success: true,
      material,
      allMaterials
    });
  } catch(error) {
    console.log(error);
    next(error);
  }
});






// get all materials from db and send it to the client side  
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  console.log('line 45 getProducts:', req.body)
  try {
    const products = await Material.find();
    // console.log(products)
    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'No products found',
      });
    }

    // Check if the current user has any pending requests for the materials in the list
const userId = req.query.userId;
    const materialRequests = await MaterialRequest.find({
      materialId: { $in: products.map(material => material._id) },
      requesterId: userId,
      status: 'pending',
    }).populate('requesterId');

    // Add a new property to the material object to indicate that there is a pending request
    const productsWithRequests = products.map(material => {
      const request = materialRequests.find(request => request.materialId.toString() === material._id.toString());
      if (request) {
        return {
          ...material.toObject(),
          hasPendingRequest: true,
          requester: request.requesterId,
        };
      } else {
        return material.toObject();
      }
    });

    res.status(200).json({
      success: true,
      products: productsWithRequests,
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
});




exports.updateUserTakenInfo = async (req, res) => {
  console.log('updateuserTaken line 90:', req.body, 'params:', req.params);
  const { userIdLS } = req.body;
  const { productId } = req.params;

  try {
    const material = await Material.findById(productId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const worker = await Workers.findById(userIdLS);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Ensure the worker has an 'avatar' field
    if (!worker.avatar || !worker.avatar.url) {
      return res.status(400).json({ message: 'Worker avatar URL not found' });
    }

    const { firstName, lastName, email, role } = worker;
    const avatarUrl = worker.avatar.url;

    const user = {
      firstName,
      lastName,
      email,
      userIdLS,
      takenAt: Date.now(),
      avatar: avatarUrl,
      role,
    };

    material.users.push(user);
    material.stock -= 1;

    const adminWorker = await Workers.findOne({ role: 'admin' });
    
    if (adminWorker) {
      material.admin = {
        firstName: adminWorker.firstName,
        lastName: adminWorker.lastName,
        avatar: adminWorker.avatar.url,
        adminId: adminWorker._id.toString(),
      };
    }

    await material.save();

    const allMaterials = await Material.find(); 
    res.status(200).json(allMaterials);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};





exports.createMaterialRequest = asyncErrorHandler(async (req, res, next) => {
  console.log('create material Request:',req.body)
  try {
    const { userId, materialId, requesterId } = req.body;
   
    // Find the requester, user_of_Taken, and material based on their IDs
    const requester = await Workers.findById(requesterId);
    const user_of_Taken = await Workers.findById(userId);
    const material = await Material.findById(materialId);
    
    if (!requester) {
      console.log('Requester not found in the workers array.');
      return res.status(400).json({ message: 'Requester not found in the workers array.' });
    }

    // Check if there's already a pending request from the requester to the user_of_Taken
    const existingRequest = await MaterialRequest.findOne({
      materialId,
      requesterId: userId, // Reversed requesterId and userId
      userId_of_Taken: requesterId, // Reversed requesterId and userId
      status: 'pending'
    });



    if (existingRequest) {
      console.log('A pending request already exists for this user_of_Taken.');
      return res.status(400).json({ message: 'A pending request already exists for this user_of_Taken.' });
    }
     
    

    const materialRequest = new MaterialRequest({
      materialId,
      requesterId: userId, 
      userId_of_Taken: requesterId, 
      requestDate: new Date(),
      status: 'pending',
      requesterName: `${user_of_Taken.firstName} ${user_of_Taken.lastName}`, 
      requesterAvatar: user_of_Taken.avatar.url, 
      materialPicture: material.images.url,
    });



await materialRequest.save();



    // Store the response data
    const response = {
      message: 'Request sent successfully!',
      material: material,
      userData: {
        name: `${requester.firstName} ${requester.lastName}`, 
        avatar: requester.avatar.url, 
      },
      materialData: {
        picture: material.images.url,
      },
      requestDate: materialRequest.requestDate,
    };

    // Send the response back
    res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
});







  // Get All Products
exports.searchProducts = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.query);
  const resultPerPage = 12;
  const productsCount = await Material.countDocuments();

  const searchFeature = new SearchFeatures(Material.find(), req.query)
      .search()
      .filter();

  let products = await searchFeature.query;
  let filteredProductsCount = products.length;

  searchFeature.pagination(resultPerPage);

  products = await searchFeature.query.clone();

 const response = {
  success:true,
  products,
  productsCount,
  resultPerPage,
  filteredProductsCount,
 };
//  console.log(response);
 res.status(200).json(response)
});




exports.updateGeolocation = asyncErrorHandler(async (req, res, next) => {
  // console.log(req.body);
  const { latitude, longitude, userIdLS, materialId } = req.body;
  console.log("Update material:id:", materialId);
  try {
    if (!materialId) {
      console.log('Invalid materialId:', materialId);
      return;
    }

    // Find the material by its ID
    const material = await Material.findOne({ _id: materialId });

    if (material) {
      // Find the user with the matching userIdLS
      const user = material.users.find((user) => user.userIdLS === userIdLS);

      if (user) {
        // Update the user's latitude and longitude if they don't match the old values
        if (user.latitude !== latitude || user.longitude !== longitude) {
          user.latitude = latitude;
          user.longitude = longitude;
          await material.save(); // Save the changes to the material document
          console.log('User location updated:', user);
        } else {
          console.log('User location already up to date:', user);
        }
      } else {
        console.log('User not found for the given userIdLS:', userIdLS);
      }
    } else {
      console.log('Material not found for the given materialId:', materialId);
    }
  } catch (error) {
    console.error('Error updating user location:', error);
  } finally {
    // Send a response back to the client if needed
  }
});


exports.updateGeolocationByIp = async (req, res) => {
  console.log(req.body);
  const myApiKey = '6c105f5d9e926dc7f86df2da63b2e5f3';

  if (req.body.ipAddress) {
    const { ipAddress } = req.body;
    const url = `http://api.ipstack.com/${ipAddress}?access_key=${myApiKey}`;
    
    try {
      const response = await axios.get(url);
      console.log("lat & lon response: ", response.data);
      
      return res.json(response.data);
    } catch (error) {
      console.error('Error getting IP geolocation:', error.message);
      return res.status(500).json({ message: 'Error getting IP geolocation' });
    }
  }
  
  const { ipAddress, userIdLS, materialId } = req.body;
  const url = `http://api.ipstack.com/${ipAddress}?access_key=${myApiKey}`;
  try {
    const response = await axios.get(url);
    // console.log("lat & lon response: ", response.data);
    
    const { latitude, longitude } = response.data;
    Material.findOneAndUpdate(
      { _id: materialId, 'users.userIdLS': userIdLS },
      { $set: { 'users.$.latitude': latitude, 'users.$.longitude': longitude } },
      { new: true }
    )
      .then((updatedMaterial) => {
        // console.log(updatedMaterial);
        if (updatedMaterial) {
          console.log('Geolocation updated successfully');
          res.json({ latitude, longitude }); // Send latitude and longitude in the response
        } else {
          console.log('Material not found or user not authorized');
          res.status(404).json({ message: 'Material not found or user not authorized' });
        }
      })
      .catch((error) => {
        console.error('Failed to update geolocation:', error.message);
        res.status(500).json({ message: 'Failed to update geolocation' });
      });
  } catch (error) {
    console.error('Error getting IP geolocation:', error.message);
    res.status(500).json({ message: 'Error getting IP geolocation' });
  }
};





exports.deleteMaterial = asyncErrorHandler(async (req, res) => {
  console.log('params:',req.params)
  try {
    const { id } = req.params;
    await Material.findByIdAndRemove(id);
    
    // Fetch all materials after deletion
    const materials = await Material.find();
    
    res.status(200).json({ success: true, message: 'Material deleted successfully', materials });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to delete material' });
  }
});


exports.editMaterials = asyncErrorHandler(async (req, res) => {
  console.log('i got it req', req.body); 
  const { id, field, value } = req.body;

  try {
    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (!material[field]) {
      return res
        .status(400)
        .json({ message: `Field ${field} does not exist in the material model` });
    }

    material[field] = value;

    await material.save(); // Corrected, added ()

    // console.log('Material updated:', material);
    return res.status(200).json({ message: 'Material updated successfully', material });
  } catch (error) {
    console.error('Error updating material:', error);

    // Send an error response
    return res.status(500).json({ message: 'Error updating material', error });
  }
});



