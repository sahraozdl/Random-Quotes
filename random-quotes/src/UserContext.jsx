import { createContext, useReducer, useEffect } from "react";
import {
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "./firebase/config";

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

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, {
    id: null,
    likedQuotes: [],
    dislikedQuotes: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: UserActionTypes.SetUser,
          payload: {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            likedQuotes: [],
            dislikedQuotes: [],
          },
        });
      } else {
        dispatch({
          type: UserActionTypes.SetUser,
          payload: { 
            id: null,
            email: null,
            name: null,
            photoURL: null,
            likedQuotes: [],
             dislikedQuotes: [] },
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};