const initialState = "not authenticated";

export default function teacher(state = initialState, action) {
  switch (action.type) {
    case "ADD_TEACHER":
      console.log(action.payload.auth);
      return action.payload;
    case "LOGOUT_TEACHER":
      return initialState;
    default:
      return state;
  }
}
