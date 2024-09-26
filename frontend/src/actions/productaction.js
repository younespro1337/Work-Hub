import axios from "axios";

import {
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
} from "../constants/productConstants";

export  const createProduct = (productData) => async (dispatch) => {
  try {
      dispatch({ type: NEW_PRODUCT_REQUEST });
      const config = { header: { "Content-Type": "application/json" } }
      const { data } = await axios.post("/api/v1/admin/material/new", productData, config);
      dispatch({
          type: NEW_PRODUCT_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: NEW_PRODUCT_FAIL,
          payload: error.response.data.message,
      });
  }
}

// Get All Products ---material SLIDER
export const getProducts = async () => {
  try {
    const { data } = await axios.get('/api/v1/admin/products/all');
    return data;
  } catch (error) {
    console.log(error.message)
    throw new Error(error.response.data.message);
  }
};

// Get from Get buttton when user
export const updateProduct = async (productId,userIdLS ) => {
  try {
    const config = { header: { "Content-Type": "application/json" } }
    const { data } = await axios.put(`/api/v1/admin/material/${productId}`, {
      userIdLS,
    }, config);
    return data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

// send a request to the worker who already use the material 
export const sendRequest = async (userId, materialId, requesterId) => {

  try {
    const requestData = {
      userId:userId,
      materialId:materialId,
      requesterId:requesterId
    }
    const { data } = await axios.post("/api/v1/material/request", requestData);
    console.log(data); // add this line to log the data
    return data;
  } catch (error) {
    console.log(error.response.data.message);
    throw new Error(error.response.data.message);
  }
};






