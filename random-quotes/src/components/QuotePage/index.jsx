import { useParams } from "react-router";
import "./index.css";
export const  QuotePage = () => {
  const params = useParams();
  const { id } = params;
  return (
    params &&
    <div className="quote-page">
      <h1>Quote Page</h1>
      <p>This is the Quote With ID: {id}.</p>
    </div>
  );
}