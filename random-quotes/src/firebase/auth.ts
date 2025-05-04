import { useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./config";
import { ensureUserDocExists, fetchAndDispatchUser } from "./utils";
import { UserDispatchContext } from "../UserContext";
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
        await ensureUserDocExists(user);
        await fetchAndDispatchUser(user.uid, dispatch);

        setSuccessMessage("Signed up successfully!");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await ensureUserDocExists(user);
        await fetchAndDispatchUser(user.uid, dispatch);

        setSuccessMessage("Signed in successfully!");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center
    h-3/6"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold">{isSignUp ? "Sign Up" : "Sign In"}</h2>

      <label htmlFor="email" className="text-left w-1/2">
        Email:
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-1/2 p-2 rounded border-solid mb-2"
      />
      <label htmlFor="password" className="text-left w-1/2">
        Password:
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-1/2 p-2 rounded border-solid mb-2"
      />

      <button
        type="submit"
        className="w-24 h-12 text-sm bg-yellow-300 text-blue-950 font-bold rounded-lg shadow-md hover:text-yellow-200 hover:bg-blue-950 transition duration-300 ease-in-out "
      >
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>

      {error && (
        <p className="text-yellow-400 text-lg font-bold  p-4 drop-shadow-3xl">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="text-yellow-400 text-lg font-bold  p-4 drop-shadow-3xl">
          {successMessage}
        </p>
      )}

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
