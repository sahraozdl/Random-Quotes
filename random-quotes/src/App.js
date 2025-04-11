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
      <nav >
        <ul className="nav--top--list">
        <li>
          <NavLink to="/" className="nav-btn" end>Home</NavLink>
          </li>
        <li>
          <NavLink to="/user/settings" className="nav-btn" end>User</NavLink>
          </li>
        <li>
          <NavLink to="/user/login" className="nav-btn" end>Login</NavLink>
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
