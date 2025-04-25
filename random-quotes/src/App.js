import { AppRouter } from "./AppRoute";
import { NavLink } from "react-router";
import { useContext, useState } from "react";
import {
  UserContext,
  UserActionTypes,
  UserDispatchContext,
} from "./UserContext";
import { auth } from "./firebase/config";
import { signOut } from "firebase/auth";

function App() {
  const { user } = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);
  const [userLoggedOutMessagge, setUserLoggedOutMessagge] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({
        type: UserActionTypes.SetUser,
        payload: null,
      });
      setUserLoggedOutMessagge("User logged out successfully.");
      setTimeout(() => {
        setUserLoggedOutMessagge("");
      }, 3000); // Clear message after 3 seconds
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="App">
      <nav>
        <ul className="nav--top--list">
          <li>
            <NavLink to="/" className="nav-btn" end>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/user/profile" className="nav-btn" end>
              Profile
            </NavLink>
            <ul className="dropdown-menu">
              <li>
                <NavLink to="/user/settings" className="dropdown-item">
                  Settings
                </NavLink>
              </li>
              <li>
                <NavLink to="/user/quotes" className="dropdown-item">
                  Quotes
                </NavLink>
              </li>
            </ul>
          </li>
          {!user && (
            <li>
              <NavLink to="/user/login" className="nav-btn" end>
                Login
              </NavLink>
            </li>
          )}
          {user && (
            <li>
              <button className="nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
      {userLoggedOutMessagge && (
        <p className="user_messagge">{userLoggedOutMessagge}</p>
      )}
      <AppRouter />
    </div>
  );
}

export default App;