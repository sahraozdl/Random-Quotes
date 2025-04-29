import { useParams } from "react-router";

export const QuotePage = () => {
  const params = useParams();
  const { id } = params;
  return (
    params && (
      <div className="bg-white rounded-lg p-10 my-12 mx-auto max-h-full">
        <h1>Quote Page</h1>
        <p>This is the Quote With ID: {id}.</p>
      </div>
    )
  );
};
