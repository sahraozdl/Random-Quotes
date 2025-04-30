import { AppRouter } from "./AppRoute";
import { NavLink } from "react-router";
import { useContext, useState } from "react";
import {
  UserContext,
  UserActionTypes,
  UserDispatchContext,
  initialUserState,
} from "./UserContext";
import { auth } from "./firebase/config";
import { signOut } from "firebase/auth";

function App() {
  const { user, loading } = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);
  const [userLoggedOutMessagge, setUserLoggedOutMessagge] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({
        type: UserActionTypes.SetUser,
        payload: initialUserState,
      });
      setUserLoggedOutMessagge("User logged out successfully.");
      setTimeout(() => {
        setUserLoggedOutMessagge("");
      }, 3000);
    } catch (error) {
      console.error("Error signing out: ", error);
      setUserLoggedOutMessagge("Error logging out, please try again.");
    }
  };

  const navlinkStyles = "bg-none border-none text-white text-2xl font-bold py-3 px-5 rounded-lg no-underline focus:bg-yellow-400 focus:text-black hover:cursor-pointer  hover:bg-yellow-400 hover:text-black";

  return (
    <div className="text-center bg-black w-full m-0 p-0 h-full text-lg">
      {!loading ? (
        <>
          <nav>
            <ul className="flex flex-row justify-end gap-4 items-center p-4 list-none mt-4">
              <li>
                <NavLink
                  to="/"
                  className={navlinkStyles}
                  end
                >
                  Home
                </NavLink>
              </li>
              {!user.email && (
                <li>
                  <NavLink
                    to="/user/login"
                    className={navlinkStyles}
                    end
                  >
                    Login
                  </NavLink>
                </li>
              )}
              {user.email && (
                <>
                  <li className="relative group">
                    <NavLink
                      to="/user/profile"
                      className={navlinkStyles}
                      end
                    >
                      Profile
                    </NavLink>
                    <ul className="absolute top-full left-0 bg-slate-900 text-white mt-3 w-full rounded-md p-3 hidden group-hover:block z-50 transition-all">
                      <li className="px-0 py-1 list-none">
                        <NavLink
                          to="/user/settings"
                          className="block py-2 px-4 no-underline text-yellow-200 hover:bg-yellow-400 hover:text-black hover:rounded-lg"
                        >
                          Settings
                        </NavLink>
                      </li>
                      <li className="px-0 py-1 list-none">
                        <NavLink
                          to="/user/quotes"
                          className="block py-2 px-4 no-underline text-yellow-200 hover:bg-yellow-400 hover:text-black hover:rounded-lg"
                        >
                          Quotes
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <button
                      className={navlinkStyles}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
          {userLoggedOutMessagge && (
            <p className="text-yellow-400 text-base font-bold py-1 px-5 m-0 text-left">
              {userLoggedOutMessagge}
            </p>
          )}
          <AppRouter />
        </>
      ) : (
        <div className="flex items-center justify-center h-screen bg-black">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400"></div>
        </div>
        //added because of home/login was showing on reload even user logged in
      )}
    </div>
  );
}

export default App;
