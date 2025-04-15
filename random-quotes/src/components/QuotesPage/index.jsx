// QuotesPage component to display liked and disliked quotes for a user
// This component fetches quotes from Firestore and filters them based on the user's liked and disliked quotes.
import React, { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { UserContext } from "../../UserContext";

export const QuotesPage = () => {
  const {user} = useContext(UserContext);
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
    <section className="container">
      <div className="inner-container">
      <div class="flex flex-row justify-evenly gap-2 mx-auto my-0">
        <button
          className="btn-yellow"
          onClick={() => setShowLiked((prev) => !prev)}
        >
          Liked Quotes
        </button>
        <button
          className="btn-yellow"
          onClick={() => setShowDisliked((prev) => !prev)}
        >
          Disliked Quotes
        </button>
      </div>
      <div class="flex flex-row gap-2 justify-center p-5 m-0">
        {showLiked && (
          <div className="quotes-box">
            <p class="text-yellow-300 font-bold text-xl">Liked quotes:</p>
            <ul class="text-left px-2">
              {likedQuotes.length > 0 ? (
                likedQuotes.map((quote) => (
                  <li key={quote.id} class="py-2">
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
          <div className="quotes-box">
            <p class="text-yellow-300 font-bold text-xl">Disliked quotes:</p>
            <ul class="text-left px-2">
              {dislikedQuotes.length > 0 ? (
                dislikedQuotes.map((quote) => (
                  <li key={quote.id} class="py-2">
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