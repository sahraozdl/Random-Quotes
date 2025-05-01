import { HiArrowNarrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router";

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 font-medium py-2 px-2 rounded-lg transition"
    >
      <HiArrowNarrowLeft className="h-3 w-3 m-0" />
    </button>
  );
}