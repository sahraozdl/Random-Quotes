import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "./firebase/config"; // Assuming you have your firebase config here
import { doc, getDoc } from "firebase/firestore";
import { BrowserRouter } from "react-router";

const root = ReactDOM.createRoot(document.getElementById("root"));

const AppWrapper = () => {
  const [user, setUser] = useState(null); // Store user data here
  const [loading, setLoading] = useState(true);

  // Listen to authentication state changes
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, fetch user data from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Anonymous",
            email: firebaseUser.email,
            likedQuotes: userData.likedQuotes || [],
            dislikedQuotes: userData.dislikedQuotes || [],
          });
        }
      } else {
        // User is not logged in
        setUser(null);
      }
      setLoading(false); // Data is now fetched
    });
  }, []);

  // If data is loading or no user is logged in, you can display a loading spinner or login form
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserProvider
      initialValue={user || { likedQuotes: [], dislikedQuotes: [] }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  );
};

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
