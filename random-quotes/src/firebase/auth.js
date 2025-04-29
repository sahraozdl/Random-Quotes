import { useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./config";
import { UserActionTypes, UserDispatchContext } from "../UserContext";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "./config";
import { useNavigate } from "react-router";

export const Auth = () => {
  const dispatch = useContext(UserDispatchContext);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

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
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name: "",
          email: user.email,
          likedQuotes: [],
          dislikedQuotes: [],
          favoriteCategories: [],
          phone: "",
          photoURL: null,
        });

        dispatch({
          type: UserActionTypes.SetUser,
          payload: {
            id: user.uid,
            email: user.email,
            name: "",
            likedQuotes: [],
            dislikedQuotes: [],
            favoriteCategories: [],
            phone: "",
            photoURL: "",
          },
        });
        setSuccessMessage("Signed up successfully!");
        setTimeout(() => {
          navigate("/"); // Redirect to profile page after 3 seconds
        }, 3000);
        console.log("User signed up successfully: ", userCredential.user);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

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

        const userData = userSnap.exists()
          ? userSnap.data()
          : {
              id: user.uid,
              email: user.email,
              name: "",
              likedQuotes: [],
              dislikedQuotes: [],
              favoriteCategories: [],
              phone: "",
              photoURL: "",
            };

        dispatch({
          type: UserActionTypes.SetUser,
          payload: userData,
        });

        setSuccessMessage("Signed in successfully!");
        setTimeout(() => {
          navigate("/"); // Redirect to profile page after 3 seconds
        }, 3000);
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
        className="w-1/2 p-2 rounded border-solid mb-2"
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-1/2 p-2 rounded border-solid mb-2"
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
            <span
              onClick={toggleMode}
              className="underline text-black font-bold text-lg cursor-pointer"
            >
              Sign In
            </span>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <span
              onClick={toggleMode}
              className="underline text-black font-bold text-lg cursor-pointer"
            >
              Sign Up
            </span>
          </>
        )}
      </p>
    </form>
  );
};

export default Auth;
