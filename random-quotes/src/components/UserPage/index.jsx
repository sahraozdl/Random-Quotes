import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./index.css";

const defaultAvatar = "../default-avatar.jpg";

export const UserPage = () => {
  const user = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore on component mount
  useEffect(() => {
    console.log("User ID:", user?.id);
    const fetchUserData = async () => {
      if (!user?.id) return;

      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user?.id]);

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (!userData) {
    return <p>No user data available.</p>;
  }

  return (
    <section className="user-page user-page__info">
      <h2 className="user-page__heading">Your Profile</h2>

      <div className="user-page__card">
        <img
          src={user.photoURL || defaultAvatar}
          alt="User profile"
          className="user-page__avatar"
        />

        <div className="user-page__details">
          <p>
            <strong>Name:</strong> {userData.name || "No name available"}
          </p>
          <p>
            <strong>Email:</strong> {user.email || "No email available"}
          </p>
          <p>
            <strong>Phone:</strong> {userData.phone || "No phone available"}
          </p>
          <p>
            <strong>User ID:</strong> {user.id}
          </p>
          <p>
            <strong>Favorite Categories:</strong> {userData.favoriteCategories?.join(", ") || "No categories available"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserPage;