import { createContext, useReducer, useEffect, ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import { useState } from "react";

export enum UserActionTypes {
  SetUser = "SET_USER",
  UpdateLikedQuotes = "UPDATE_LIKED_QUOTES",
  UpdateDislikedQuotes = "UPDATE_DISLIKED_QUOTES",
};

export interface User {
  id?: string;
  email?: string;
  name?: string;
  likedQuotes: string[];
  dislikedQuotes: string[];
  favoriteCategories?: string[];
  photoURL?: string;
  phone?: string;
}

export const initialUserState: User = {
  id: "",
  name: "",
  email: "",
  phone: "",
  likedQuotes: [],
  dislikedQuotes: [],
  favoriteCategories: [],
  photoURL: "",
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserDispatchContext = createContext<React.Dispatch<UserAction> | undefined>(undefined);

type UserAction =
  | { type: UserActionTypes.SetUser; payload: User }
  | { type: UserActionTypes.UpdateLikedQuotes; payload: { id: string } }
  | { type: UserActionTypes.UpdateDislikedQuotes; payload: { id: string } };

const userReducer = (state: User, action: UserAction): User => {
  switch (action.type) {
    case UserActionTypes.SetUser:
      return {
        ...initialUserState,
        ...action.payload,
      };;

    case UserActionTypes.UpdateLikedQuotes:
      if (state.likedQuotes.includes(action.payload.id)) {
        return state;
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
        return state;
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
      throw new Error(`Unhandled action type: ${(action as any).type}`);
  }
};

interface UserContextType {
  user: User;
  loading: boolean;
  dispatch: React.Dispatch<UserAction>;
}



interface UserProviderProps {
  children: ReactNode;
  initialValue?: User;
}

export const UserProvider = ({ children, initialValue = initialUserState }: UserProviderProps) => {
  const [user, dispatch] = useReducer(userReducer, initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          dispatch({
            type: UserActionTypes.SetUser,
            payload: {
              id: authUser.uid,
              email: authUser.email || "",
              name: userData.name || authUser.displayName || "",
              photoURL: userData.photoURL || authUser.photoURL || "",
              phone: userData.phone || "",
              likedQuotes: userData.likedQuotes || [],
              dislikedQuotes: userData.dislikedQuotes || [],
              favoriteCategories: userData.favoriteCategories || [],
            },
          });
        }
      } else {
        dispatch({
          type: UserActionTypes.SetUser,
          payload: initialUserState,
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