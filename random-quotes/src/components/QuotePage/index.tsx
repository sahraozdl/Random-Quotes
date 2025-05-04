import { useParams } from "react-router";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { QuoteDetailBox } from "../QuoteDetailBox";
import { BackButton } from "../BackButton";

import { QuoteData } from "../types/Quote";

export const QuotePage = () => {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) return;

      try {
        const quoteRef = doc(db, "quotes", id);
        const quoteSnap = await getDoc(quoteRef);

        if (quoteSnap.exists()) {
          const data = quoteSnap.data();
          if (data.quote && data.author && data.id) {
            setQuote(data as QuoteData);
          } else {
            console.error("Invalid quote data");
          }
        }
      } catch (error) {
        console.error("Error fetching quote", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (!quote || !id) {
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
        <BackButton />
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
