import "./index.css";
import { useState, useContext, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./config";
import { UserActionTypes, UserDispatchContext } from "../UserContext";
import { setDoc,doc } from "firebase/firestore";
import { db } from "./config";

export const Auth = () => {
  const dispatch = useContext(UserDispatchContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setEmail("");
    setPassword("");
    setError(null);
    setSuccessMessage("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await setDoc(
          doc(db, "users", user.uid),
          { 
            id: user.uid,
            name: "Anonymous",
            email: user.email,
            likedQuotes: [],
            dislikedQuotes: [],
            favoriteCategories: [],
            phone: "",
            photoURL: null,
          }
        );

        dispatch({
          type: UserActionTypes.SetUser,
          payload: { id: user.uid, email: user.email },
        });
        setSuccessMessage("Signed up successfully!");
        console.log("User signed up successfully: ", userCredential.user);
      } else {
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
        setSuccessMessage("Signed in successfully!");
        console.log("User signed in successfully: ", userCredential.user);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <form className="auth-container" onSubmit={handleSubmit}>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />

      <button type="submit" className="auth-btn">
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {successMessage && <p className="success-message">{successMessage}</p>}

      <p className="toggle-auth">
        {isSignUp ? (
          <>
            Already have an account?{" "}
            <span onClick={toggleMode} className="link">
              Sign In
            </span>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <span onClick={toggleMode} className="link">
              Sign Up
            </span>
          </>
        )}
      </p>
    </form>
  );
};

export default Auth;