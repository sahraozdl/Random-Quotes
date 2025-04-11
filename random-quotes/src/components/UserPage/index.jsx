import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./index.css";

export const UserPage = () => {
  const user  = useContext(UserContext); // Assuming UserContext provides user info
  const [userData, setUserData] = useState(null); // State for user data from Firestore
  const [loading, setLoading] = useState(true); // To handle loading state

  // Fetch user data from Firestore on component mount
  useEffect(() => {
    console.log("User ID:", user?.id);  // Debugging line
    const fetchUserData = async () => {
      if (!user?.id) return; // Ensure user id is available

      const userRef = doc(db, "users", user.id); // Reference to the user's document
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data()); // Save data to state
      }
      setLoading(false); // Set loading to false after fetching
    };

    fetchUserData();
  }, [user?.id]);

  // Loading state
  if (loading) {
    return <p>Loading user profile...</p>;
  }

  // Fallback if no user data is found
  if (!userData) {
    return <p>No user data available.</p>;
  }

  return (
    <section className="user-page user-page__info">
      <h2 className="user-page__heading">Your Profile</h2>

      <div className="user-page__card">
        {userData.photoURL && (
          <img
            src={userData.photoURL}
            alt="User profile"
            className="user-page__avatar"
          />
        )}

        <div className="user-page__details">
          <p><strong>Name:</strong> {userData.name || "No name available"}</p>
          <p><strong>Email:</strong> {userData.email || "No email available"}</p>
          <p><strong>Phone:</strong> {userData.phone || "No phone available"}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      </div>
    </section>
  );
};

export default UserPage;
