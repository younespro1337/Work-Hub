const express = require('express');
const { 
    createProduct,
    getProducts,
    updateUserTakenInfo, 
    createMaterialRequest, 
    searchProducts, 
    updateGeolocation,
    updateGeolocationByIp,
    deleteMaterial,
    editMaterials
} = require('../controllers/productController');
const router = express.Router();

router.get('/products/search/:keyword', searchProducts);
router.route('/admin/products/all').get(getProducts); 
router.route('/admin/material/new').post(createProduct); 
router.route('/admin/material/:productId').put(updateUserTakenInfo); 
router.route('/material/request').post(createMaterialRequest);
router.route('/updateLocation').post(updateGeolocation)
router.post('/updateGeolocationByIp', updateGeolocationByIp)
router.delete('/material/:id', deleteMaterial);
router.post('/editMaterials', editMaterials)
module.exports = router;
