import { QuoteData } from "../../types/Quote";

export function QuoteDetailBox({ id, quote, author, category }: QuoteData) {
  return (
    <div className="flex flex-col text-left h-full justify-around">
      <div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Details</h2>
      </div>
      <p className="text-lg text-blue-950 mb-2">
        <span className="font-semibold">Quote:</span> “{quote}”
      </p>
      <p className="text-md text-blue-950 mb-2">
        <span className="font-semibold">Author:</span> {author || "Unknown"}
      </p>
      <p className="text-md text-blue-950 mb-2">
        <span className="font-semibold">Category:</span> {category || "No category available for this quote"}
      </p>
      <p className="text-sm text-indigo-900">ID: {id}</p>
    </div>
  );
}