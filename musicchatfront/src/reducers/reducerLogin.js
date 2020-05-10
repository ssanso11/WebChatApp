const initialState = "not authenticated";

export default function user(state = initialState, action) {
  switch (action.type) {
    case "ADD_USER":
      console.log(action.payload.auth);
      return action.payload;
    case "LOGOUT_USER":
      return initialState;
    case "ADD_TEACHER_USER":
      console.log(action);
      const arr = state.auth.teachers;
      return Object.assign({}, state, {
        auth: {
          ...state.auth,
          teachers: arr.concat(action.payload),
        },
      });
    // return {
    //   ...state,
    //   ...state.auth.teachers: [...state.auth.teachers, action.id],
    // }

    default:
      return state;
  }
}
