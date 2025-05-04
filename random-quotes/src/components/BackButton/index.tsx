import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 font-medium py-2 px-2 rounded-lg transition"
    >
      <ArrowLeft className="h-4 w-4 m-0" />
    </button>
  );
}