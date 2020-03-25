import { combineReducers } from 'redux';

const initialState = "not authenticated";

const user = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_USER':
        return action.payload.responseJson;
    //   case 'ADD_NOTIF_TOKEN':
    //     return action.payload.responseJson;
    //   case 'LOGOUT_USER':
    //     return initialState;
      default:
        return state;
    }
};

export default combineReducers({
  user,
});