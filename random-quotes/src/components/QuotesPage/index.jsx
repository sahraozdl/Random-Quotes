// QuotesPage component to display liked and disliked quotes for a user
// This component fetches quotes from Firestore and filters them based on the user's liked and disliked quotes.
import React, { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { UserContext } from "../../UserContext";
import "./index.css";

export const QuotesPage = () => {
  const user = useContext(UserContext);
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
    <section className="quotes-page">
      <button
        className="quotes-btn"
        onClick={() => setShowLiked((prev) => !prev)}
      >
        Liked Quotes
      </button>

      {showLiked && (
        <div className="quotes-page__liked">
          <p className="quotes-page__p black-shadow">Liked quotes:</p>
          <ul className="black-shadow quotes-page__liked-list">
            {likedQuotes.length > 0 ? (
              likedQuotes.map((quote) => (
                <li key={quote.id}>
                  <p>{quote.quote}</p>
                  <span>{quote.author}</span>
                  <hr />
                </li>
              ))
            ) : (
              <p>No liked quotes yet.</p>
            )}
          </ul>
        </div>
      )}

      <button
        className="quotes-btn"
        onClick={() => setShowDisliked((prev) => !prev)}
      >
        Disliked Quotes
      </button>
      {showDisliked && (
        <div className="quotes-page__disliked">
          <p className="quotes-page__p white-shadow">Disliked quotes:</p>
          <ul className="white-shadow quotes-page__disliked-list">
            {dislikedQuotes.length > 0 ? (
              dislikedQuotes.map((quote) => (
                <li key={quote.id}>
                  <p>{quote.quote}</p>
                  <span>{quote.author}</span>
                  <hr />
                </li>
              ))
            ) : (
              <p>No disliked quotes yet.</p>
            )}
          </ul>
        </div>
      )}
    </section>
  );
};

export default QuotesPage;
