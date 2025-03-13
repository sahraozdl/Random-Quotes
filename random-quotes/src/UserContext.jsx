/*import { createContext, useReducer } from "react";

export const UserContext= createContext();
export const UserDispatchContext = createContext();

export const UserActionTypes = {
  SetUser:'SET_USER',
  UpdateLikedQuotes:'UPDATED_LIKED_QUOTES',
  UpdateDislikedQuotes:'UPDATED_DISLIKED_QUOTES'
};

const userReducer= (state,action) => {
switch (action.type){
  case UserActionTypes.SetUser:
    return action.payload;
  case UserActionTypes.UpdateLikedQuotes:
    if (state.dislikedQuotes.includes(action.payload.id)){
      const updatedDislikedQuotes = state.dislikedQuotes.filter((dislikedQuotesId) => dislikedQuotesId !== action.payload.id);
      return {
        ...state,
        likedQuotes: [...state.likedQuotes, action.payload.id],
        dislikedQuotes: updatedDislikedQuotes,
      }
    }
    return {
      ...state,
      likedQuotes: [...state.likedQuotes,action.payload.id],
    };
    //return action.payload;
  case  UserActionTypes.UpdateDislikedQuotes:
    if (state.likedQuotes.includes(action.payload.id)){
      const updatedLikedQuotes = state.likedQuotes.filter(
        (likedQuotesId) => likedQuotesId !== action.payload.id);
        return {
          ...state,
          dislikedQuotes:[...state.dislikedQuotes, action.payload.id],
          likedQuotes: updatedLikedQuotes,
        }
    }
    return {
      ...state,
      dislikedQuotes: [...state.dislikedQuotes,action.payload.id],
    };
    //return action.payload;
    default:
      throw Error(`Action type ${action.type} is not supported`);
}
}

export const UserProvider = ({initialValue, children}) => {
  const [user, dispatch] = useReducer(userReducer,initialValue);
  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}*/
import { createContext, useReducer } from "react";

export const UserContext = createContext();
export const UserDispatchContext = createContext();

export const UserActionTypes = {
  SetUser: "SET_USER",
  UpdateLikedQuotes: "UPDATE_LIKED_QUOTES",
  UpdateDislikedQuotes: "UPDATE_DISLIKED_QUOTES",
};

const userReducer = (state, action) => {
  switch (action.type) {
    case UserActionTypes.SetUser:
      return action.payload;

    case UserActionTypes.UpdateLikedQuotes:
      if (state.likedQuotes.includes(action.payload.id)) {
        return state; // Prevent duplicate likes
      }

      if (state.dislikedQuotes.includes(action.payload.id)) {
        const updatedDislikedQuotes = state.dislikedQuotes.filter(
          (dislikedQuoteId) => dislikedQuoteId !== action.payload.id
        );
        return {
          ...state,
          likedQuotes: [...state.likedQuotes, action.payload.id],
          dislikedQuotes: updatedDislikedQuotes,
        };
      }

      return {
        ...state,
        likedQuotes: [...state.likedQuotes, action.payload.id],
      };

    case UserActionTypes.UpdateDislikedQuotes:
      if (state.dislikedQuotes.includes(action.payload.id)) {
        return state; // Prevent duplicate dislikes
      }

      if (state.likedQuotes.includes(action.payload.id)) {
        const updatedLikedQuotes = state.likedQuotes.filter(
          (likedQuoteId) => likedQuoteId !== action.payload.id
        );
        return {
          ...state,
          dislikedQuotes: [...state.dislikedQuotes, action.payload.id],
          likedQuotes: updatedLikedQuotes,
        };
      }

      return {
        ...state,
        dislikedQuotes: [...state.dislikedQuotes, action.payload.id],
      };

    default:
      throw new Error(`Action type ${action.type} is not supported`);
  }
};

export const UserProvider = ({
  initialValue = { id: null, likedQuotes: [], dislikedQuotes: [] },
  children,
}) => {
  const [user, dispatch] = useReducer(userReducer, initialValue);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};
