import {
    ADMIN_PRODUCTS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    CLEAR_ERRORS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_RESET,
    DELETE_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_RESET,
    NEW_PRODUCT_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_RESET,
    NEW_REVIEW_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_SUCCESS,
    REMOVE_PRODUCT_DETAILS,
    ALL_REVIEWS_REQUEST,
    ALL_REVIEWS_SUCCESS,
    ALL_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_RESET,
    DELETE_REVIEW_FAIL,
    SLIDER_PRODUCTS_FAIL,
    SLIDER_PRODUCTS_REQUEST,
    SLIDER_PRODUCTS_SUCCESS,
    // SET_MENU_OPEN
} from "../constants/productConstants";


const initialState = {
  loading: true,
  error: null,
  products: [],
};
 
export const productListReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
      return { ...state, loading: true };
    case ALL_PRODUCTS_SUCCESS:
      return { ...state, loading: false, products: action.payload };
    case ALL_PRODUCTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
 export const productsReducer = (state = { products: [] }, { type, payload }) => {

    switch (type) {
        case ALL_PRODUCTS_REQUEST:
        case ADMIN_PRODUCTS_REQUEST:
        case SLIDER_PRODUCTS_REQUEST:
            return {
                loading: true,
                products: [],
            };
        case ALL_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: payload.products,
                productsCount: payload.productsCount,
                resultPerPage: payload.resultPerPage,
                filteredProductsCount: payload.filteredProductsCount,
            };
        case ADMIN_PRODUCTS_SUCCESS:
        case SLIDER_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: payload,
            };
        case ALL_PRODUCTS_FAIL:
        case ADMIN_PRODUCTS_FAIL:
        case SLIDER_PRODUCTS_FAIL:
            return {
                loading: false,
                error: payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}

export const productDetailsReducer = (state = { material: {} }, { type, payload }) => {

    switch (type) {
        case PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading: false,
                material: payload,
            };
        case PRODUCT_DETAILS_FAIL:
            return {
                loading: false,
                error: payload,
            };
        case REMOVE_PRODUCT_DETAILS:
            return {
                ...state,
                material: {},
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}





