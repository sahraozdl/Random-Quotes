import { createContext, useReducer, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/config";

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
    name: null,
    email: null,
    phone: null,
    likedQuotes: [],
    dislikedQuotes: [],
    photoURL: null,
    favoriteCategories: [], // Added here but not sure
  });

  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log("User data from Firestore:", userData);
          dispatch({
            type: UserActionTypes.SetUser,
            payload: {
              id: authUser.uid,
              email: authUser.email,
              name: userData.name || authUser.displayName,
              photoURL: userData.photoURL || authUser.photoURL,
              phone: userData.phone || "",
              likedQuotes: userData.likedQuotes || [],
              dislikedQuotes: userData.dislikedQuotes || [],
              favoriteCategories: userData.favoriteCategories || [], // Added here but not sure
            },
          });
        }
      } else {
        dispatch({
          type: UserActionTypes.SetUser,
          payload: null,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, dispatch }}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};