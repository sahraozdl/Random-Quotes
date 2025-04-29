import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const defaultAvatar = "../default-avatar.jpg";

export const UserPage = () => {
  const { user } = useContext(UserContext);
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
    <section className="bg-white rounded-lg p-10 my-12 mx-auto max-h-full">
      <h2 className="text-2xl font-bold">Your Profile</h2>

      <div className="bg-indigo-400 border-indigo-950 border-4 rounded-lg p-5 m-auto max-w-full max-h-96 min-h-96 w-1/2">
        <img
          src={user.photoURL || defaultAvatar}
          alt="User profile"
          className="w-20 h-20 rounded-full my-0 mx-auto p-0"
        />

        <div className="flex flex-col text-left px-20 gap-1">
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
            <strong>Favorite Categories:</strong>{" "}
            {userData.favoriteCategories?.join(", ") ||
              "No categories available"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserPage;
