import "./index.css";
import { useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./config"; 
import { UserActionTypes, UserDispatchContext } from "../UserContext";

export const Auth = () => {
  const dispatch = useContext(UserDispatchContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      dispatch({
        type: UserActionTypes.SetUser,
        payload: { id: newUser.uid, email: newUser.email },
      });
      // Show success message to the user
      // You can use a state variable to show the success message on the UI
      // For example, set a success state and display it in the UI
      // setSuccess("User signed up successfully");
      console.log("User signed up:", newUser.email);
    } catch (err) {
      // Show error message to the user
      // You can use a state variable to show the error message on the UI
      // For example, set an error state and display it in the UI
      // setError(err.message);
      console.error("Error signing up:", err.message);
    }
  };

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      dispatch({
        type: UserActionTypes.SetUser,
        payload: { id: user.uid, email: user.email },
      });
      // Show success message to the user. Redirect user to the home page after 3-5 seconds.
      console.log("User signed in:", user.email);
    } catch (err) {
      // Show error message to the user
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
    // Is there's an error, show it to the user on the screen. E.g. add empty text elements under each input to display input validation error. Then, add another empty text element to display the error message from Firebase.
    // Should be a form
    <div className="auth-container">
       {/* Must have a label element */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
       {/* Must have a label element */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />
      <div className="auth-buttons">
        <button onClick={signUp} className="auth-btn">
          Sign Up
        </button>
        <button onClick={signIn} className="auth-btn">
          Sign In
        </button>
        {/* It does not make sense to place Logout button on the login page. Instead, it should be a button in the nav menu. Only show it to users that are currently logged it. 
      Also, don't show login button to users that are logged in.
      */}
        <button onClick={logOut} className="auth-btn">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Auth;