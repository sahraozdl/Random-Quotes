import { Auth } from "../../firebase/auth";

export function Login() {
  return (
    <div className="bg-white rounded-lg p-10 my-24 mx-48">
      <div className="inner-container">
        <Auth />
      </div>
    </div>
  );
}
