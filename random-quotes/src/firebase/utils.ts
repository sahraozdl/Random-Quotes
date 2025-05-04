import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config";
import { UserActionTypes, User } from "../UserContext";
import type { User as FirebaseUser } from "firebase/auth";

type UserAction = {
  type: UserActionTypes.SetUser;
  payload: Partial<User>;
};

export async function ensureUserDocExists(user: FirebaseUser): Promise<void> {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      name: "",
      likedQuotes: [],
      dislikedQuotes: [],
      favoriteCategories: [],
      phone: "",
      photoURL: "",
    });
  }
}

export async function fetchAndDispatchUser(userId: string,
  dispatch: React.Dispatch<UserAction>
): Promise<void> {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    dispatch({ type: UserActionTypes.SetUser, payload: userSnap.data() });
  } else {
    console.error("User document does not exist");
  }
}