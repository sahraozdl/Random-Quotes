// QuotesPage component to display liked and disliked quotes for a user
// This component fetches quotes from Firestore and filters them based on the user's liked and disliked quotes.
import React, { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { UserContext } from "../../UserContext";

export const QuotesPage = () => {
  const { user } = useContext(UserContext);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [dislikedQuotes, setDislikedQuotes] = useState([]);
  const [showLiked, setShowLiked] = useState(false);
  const [showDisliked, setShowDisliked] = useState(false);

  useEffect(() => {
    const fetchLikedAndDislikedQuotes = async () => {
      if (
        !user?.id ||
        !Array.isArray(user.likedQuotes) ||
        !Array.isArray(user.dislikedQuotes)
      )
        return;

      try {
        const quotesRef = collection(db, "quotes");
        const querySnapshot = await getDocs(quotesRef);

        const allQuotes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLikedQuotes(
          allQuotes.filter((quote) => user.likedQuotes.includes(quote.id))
        );
        setDislikedQuotes(
          allQuotes.filter((quote) => user.dislikedQuotes.includes(quote.id))
        );
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchLikedAndDislikedQuotes();
  }, [user]);

  return (
    <section className="bg-white rounded-lg p-10 my-12 mx-auto max-h-full w-3/4">
      <div className="bg-indigo-400 border-indigo-950 border-4 rounded-lg p-5 m-auto max-w-full max-h-96 min-h-96">
        <div className="flex flex-row justify-evenly gap-2 mx-auto my-0">
          <button
            className="w-24 h-12 text-sm bg-yellow-300 text-blue-950 font-bold rounded-lg shadow-md hover:text-yellow-200 hover:bg-blue-950 transition duration-300 ease-in-out "
            onClick={() => setShowLiked((prev) => !prev)}
          >
            Liked Quotes
          </button>
          <button
            className="w-24 h-12 text-sm bg-yellow-300 text-blue-950 font-bold rounded-lg shadow-md hover:text-yellow-200 hover:bg-blue-950 transition duration-300 ease-in-out "
            onClick={() => setShowDisliked((prev) => !prev)}
          >
            Disliked Quotes
          </button>
        </div>
        <div className="flex flex-row gap-2 justify-center p-5 m-0">
          {showLiked && (
            <div className="bg-indigo-900 text-white rounded-lg p-5 my-2 mx-0 max-w-full max-h-64 overflow-y-auto overflow-x-hidden">
              <p className="text-yellow-300 font-bold text-xl">Liked quotes:</p>
              <ul className="text-left px-2">
                {likedQuotes.length > 0 ? (
                  likedQuotes.map((quote) => (
                    <li key={quote.id} className="py-2">
                      <p>{quote.quote}</p>
                      <span>-{quote.author}</span>
                      <hr />
                    </li>
                  ))
                ) : (
                  <p>No liked quotes yet.</p>
                )}
              </ul>
            </div>
          )}

          {showDisliked && (
            <div className="bg-indigo-900 text-white rounded-lg p-5 my-2 mx-0 max-w-full max-h-64 overflow-y-auto overflow-x-hidden">
              <p className="text-yellow-300 font-bold text-xl">
                Disliked quotes:
              </p>
              <ul className="text-left px-2">
                {dislikedQuotes.length > 0 ? (
                  dislikedQuotes.map((quote) => (
                    <li key={quote.id} className="py-2">
                      <p>{quote.quote}</p>
                      <span>-{quote.author}</span>
                      <hr />
                    </li>
                  ))
                ) : (
                  <p>No disliked quotes yet.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuotesPage;
