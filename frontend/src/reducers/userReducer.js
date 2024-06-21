import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOAD_USER_REQUEST,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    LOAD_USER_SUCCESS,
    LOGOUT_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOAD_USER_FAIL,
    LOGOUT_USER_FAIL,
    CLEAR_ERRORS,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_RESET,
    UPDATE_PROFILE_RESET,
    UPDATE_PASSWORD_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_USER_REQUEST,
    DELETE_USER_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_USER_SUCCESS,
    DELETE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_FAIL,
    UPDATE_USER_RESET,
    DELETE_USER_RESET,
    SET_SIDEBARLABEL_VALUE,
    SET_SELECTED_MEMBER_DETAILS,
    SET_TASKS_DETAILS
  } from '../constants/userConstant';

  const initialState = {
    isMenuOpen: false,
    user: {},
    selectedMember: {},
    tasks:{},
    materialsRequets:{},
    loading: false,
    isAuthenticated: false,
    error: null,
  };
  
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  const persistedState = storedUser
    ? {
        ...initialState,
        isAuthenticated: true,
        user: storedUser,
      }
    : initialState;
  
  export const userReducer = (state = persistedState, { type, payload }) => {
    switch (type) {
      case LOGIN_USER_REQUEST:
      case REGISTER_USER_REQUEST:
      case LOAD_USER_REQUEST:
        return {
          ...state,
          loading: true,
          isAuthenticated: false,
        };
      case LOGIN_USER_SUCCESS:
      case REGISTER_USER_SUCCESS:
      case LOAD_USER_SUCCESS:
        localStorage.setItem('user', JSON.stringify(payload));
        return {
          ...state,
          loading: false,
          isAuthenticated: true,
          user: payload,
        };
      case LOGOUT_USER_SUCCESS:
        localStorage.removeItem('user');
        return {
          ...state,
          loading: false,
          user: null,
          isAuthenticated: false,
        };
      case LOGIN_USER_FAIL:
      case REGISTER_USER_FAIL:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          user: null,
          error: payload,
        };
      case LOAD_USER_FAIL:
        return {
          ...state,
          loading: false,
          isAuthenticated: false,
          user: null,
          error: payload,
        };
      case LOGOUT_USER_FAIL:
        return {
          ...state,
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
  };
  
  export const profileReducer = (state = {}, { type, payload }) => {
    switch (type) {
        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: payload,
            };
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: payload,
            };
        case UPDATE_PROFILE_FAIL:
        case UPDATE_PASSWORD_FAIL:
        case UPDATE_USER_FAIL:
        case DELETE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: payload,
            }
        case UPDATE_PROFILE_RESET:
        case UPDATE_PASSWORD_RESET:
        case UPDATE_USER_RESET:
            return {
                ...state,
                isUpdated: false,
            }
        case DELETE_USER_RESET:
            return {
                ...state,
                isDeleted: false,
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};


  export const menuReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_MENU_OPEN':
        return { ...state, isMenuOpen: !state.isMenuOpen };
      default:
        return state;
    }
  };
  


const initialLabeState = null;

export const sidebarReducer = (state = initialLabeState, { type, payload }) => {
  switch (type) {
    case SET_SIDEBARLABEL_VALUE:
      return payload;
    default:
      return state;
  }
};

export const memberReducer = (state = initialState, { type, payload }) => {
  switch (type) {

    case 'SET_SELECTED_MEMBER_DETAILS':
        return {
            ...state,
            selectedMember: payload,
        };

    default:
        return state;
} 
}

export const tasksDataReducer = (state = initialState, {type, payload}) => { 
   switch(type) {

    case 'SET_TASKS_DETAILS':
      return {
         ...state,
         tasksData: payload,
      };
      default: 
       return state;
   }
}


export const materialsRequets = (state = initialState, {type, payload}) => {
  switch(type) {
    case 'SET_MATERIALS_REQUETS_DETAILS': 
    return {
     ...state,
     materialsRequets:payload,
    };
    default:
      return state;
  }
}