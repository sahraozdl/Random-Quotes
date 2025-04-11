import React, {useContext } from "react";
import { UserContext} from "../../UserContext";
import "./index.css";

export const UserPage = () => {
  const  user = useContext(UserContext);


  return (
    <section className="user-page user-page__info">
      <h2 className="user-page__heading">Your Profile</h2>

      <div className="user-page__card">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="User profile"
            className="user-page__avatar"
          />
        )}

        <div className="user-page__details">
          <p><strong>Name:</strong> {user.name || "No name available"}</p>
          <p><strong>Email:</strong> {user.email|| "No email available"}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      </div>
    </section>
  );
};

export default UserPage;