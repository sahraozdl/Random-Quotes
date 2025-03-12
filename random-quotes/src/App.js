import "./App.css";
import { useState } from "react";
import { UserPage } from "./components/UserPage";
import { Home } from "./components/Home";
import { Login } from "./components/Login";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
 
  return (
    <div className="App">
      <nav className="nav--top">
        <button onClick={() => setCurrentPage("home")} className="nav-btn">Home</button>
        <button onClick={() => setCurrentPage("user")} className="nav-btn">User</button>
        <button onClick={() => setCurrentPage("login")} className="nav-btn">Login</button>
      </nav>
      { currentPage === "home" && < Home/> }
      { currentPage === "user" && <UserPage /> }
      { currentPage === "login" && <Login /> }
    </div>
  );
}

export default App;
