export const Button = ({ title, onClick, disabled }) => {
  return (
  <button
    className="w-24 h-12 px-2 text-sm bg-yellow-300 text-blue-950 font-bold rounded-lg shadow-md hover:text-yellow-200 hover:bg-blue-950 transition duration-300 ease-in-out "
    onClick={onClick}
    disabled={disabled}
  >
    {title}
  </button>
  );
};
