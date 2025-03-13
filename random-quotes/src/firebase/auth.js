/*import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState } from "react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", email);
    } catch (err) {
      console.error(err);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", email);
    } catch (err) {
      console.error("Sign-in error:", err.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      console.log("User logged out:", email);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>
      <button onClick={signIn}>Sign In</button>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};*/
import { useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config"; // Ensure the path is correct
import { UserActionTypes, UserDispatchContext } from "../UserContext"; // Import action types

export const Auth = () => {
  const dispatch = useContext(UserDispatchContext); // ✅ Use useContext to get dispatch
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Automatically update user context when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: UserActionTypes.SetUser,
          payload: { id: user.uid, email: user.email },
        });
      } else {
        dispatch({ type: UserActionTypes.SetUser, payload: null });
      }
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, [dispatch]);

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      dispatch({
        type: UserActionTypes.SetUser,
        payload: { id: newUser.uid, email: newUser.email },
      });
      console.log("User signed up:", newUser.uid);
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
