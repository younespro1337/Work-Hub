import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { userReducer, menuReducer, profileReducer, sidebarReducer, memberReducer , tasksDataReducer, materialsRequets, layoutReducer} from './reducers/userReducer';
const reducer = combineReducers({
    user: userReducer,
    header: menuReducer,
    profile: profileReducer,
    sidebarLabel: sidebarReducer,
    memeberReducer: memberReducer,
    tasksData: tasksDataReducer,
    materialsRequets:materialsRequets,
    layouts:layoutReducer
    // forgotPassword: forgotPasswordReducer,
    // users: allUsersReducer,
    //
});



let initialState = {
    header: { 
        isMenuOpen: false,
    },
    sidebarLabel: null, // Change this line
};


const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;