import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { UserProvider } from "./UserContext";

const loggedInUser = {
  id: "403661db-955f-424f-a47b-59c6a91a2e24",
  name: "John Doe",
  email: "john@gmail.com",
  likedQuotes: [],
  dislikedQuotes: [],
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider initialValue={loggedInUser}>
      <App />
    </UserProvider>
  </React.StrictMode>
);
