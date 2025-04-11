import "./App.css";
import { useState } from "react";
import { AppRouter } from "./AppRoute";
//import { useNavigate } from "react-router";
import { NavLink } from "react-router";

function App() {
  //const navigate = useNavigate();
  //const [quotes, SetQuotes] = useState([]);

  return (
    <div className="App">
      <nav>
        <ul className="nav--top--list">
          <li>
            <NavLink to="/" className="nav-btn" end>
              Home
            </NavLink>
          </li>
          <li className="nav-item dropdown">
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
          <li>
            <NavLink to="/user/login" className="nav-btn" end>
              Login
            </NavLink>
          </li>
          <li>
            <button className="nav-btn">Logout</button>
          </li>
        </ul>
      </nav>
      <AppRouter />
    </div>
  );
}

export default App;
