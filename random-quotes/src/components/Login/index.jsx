import { Auth } from "../../firebase/auth";

export function Login() {
  return (
    <div className="bg-white rounded-lg p-10 my-24 mx-48">
      <div className="bg-indigo-400 border-indigo-950 border-4 rounded-lg p-5 m-auto max-w-full max-h-96 min-h-96">
        <Auth />
      </div>
    </div>
  );
}
