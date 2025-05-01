import { useParams } from "react-router";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { QuoteDetailBox } from "../QuoteDetailBox";

export const QuotePage = () => {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const quoteRef = doc(db, "quotes", id);
        const quoteSnap = await getDoc(quoteRef);

        if (quoteSnap.exists()) {
          setQuote(quoteSnap.data());
        } else {
          console.error("Quote not found");
        }
      } catch (error) {
        console.error("Error fetching quote", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuote();
  }, [id]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!quote) {
    return (
      <div className="bg-white rounded-lg p-10 my-12 mx-auto max-h-full w-3/4">
        <h1>Quote Not Found</h1>
        <p>No quote found with ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-10 my-12 mx-auto max-h-full w-3/4">
      <div className="bg-indigo-400 border-indigo-950 border-4 rounded-lg p-5 m-auto max-w-full h-96">
        <QuoteDetailBox
          id={id}
          quote={quote.quote}
          author={quote.author}
          category={quote.category}
        />
      </div>
    </div>
  );
};
