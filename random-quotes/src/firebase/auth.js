import { useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config"; // Ensure the path is correct
import { UserActionTypes, UserDispatchContext } from "../UserContext"; // Import action types

export const Auth = () => {
  const dispatch = useContext(UserDispatchContext); // ✅ Use useContext to get dispatch
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      dispatch({
        type: UserActionTypes.SetUser,
        payload: { id: newUser.uid, email: newUser.email },
      });
      console.log("User signed up:", newUser.email);
    } catch (err) {
      console.error("Error signing up:", err.message);
    }
  };

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch({
        type: UserActionTypes.SetUser,
        payload: { id: user.uid, email: user.email },
      });
      console.log("User signed in:", user.email);
    } catch (err) {
      console.error("Sign in error:", err.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      dispatch({ type: UserActionTypes.SetUser, payload: null }); // Remove user from context
      console.log("User logged out");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>
      <button onClick={signIn}>Sign In</button>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};

export default Auth;