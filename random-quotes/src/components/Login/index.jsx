import { Auth } from "../../firebase/auth"; 
import "./index.css";

export function Login(){
 return (
  <div className="login-container">
    <div className="login">
      <Auth />
    </div>
    </div>
 )
}
