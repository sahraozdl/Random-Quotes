import "./App.css";
import { useState } from "react";
import { UserPage } from "./components/UserPage";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
//import {db} from "./config/firebase";
//import {collection, getDocs} from "firebase/firestore";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [quotes, SetQuotes] = useState([]);
  /*const quoteList = collection(db, "quotes");
  useEffect(() => {
   const getQuoteList= async () => {
    try{
     const data = await getDocs(quoteList);
     const filteredData = data.docs.map((doc) => ({...doc.data()}))
     SetQuotes(filteredData);
    } catch (err) {
      console.error(err);
    };
    getQuoteList();
   }
  }, []);*/

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
