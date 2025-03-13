import React, { useEffect, useState, useContext } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { UserContext } from "../../UserContext";
import "./index.css";

export const UserPage = () => {
  const { user } = useContext(UserContext);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [dislikedQuotes, setDislikedQuotes] = useState([]);

  useEffect(() => {
    const fetchLikedAndDislikedQuotes = async () => {
      if (!user || !user.likedQuotes || !user.dislikedQuotes) return;

      const quotesRef = collection(db, "quotes");
      const querySnapshot = await getDocs(quotesRef);

      const allQuotes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLikedQuotes(allQuotes.filter((quote) => user.likedQuotes.includes(quote.id)));
      setDislikedQuotes(allQuotes.filter((quote) => user.dislikedQuotes.includes(quote.id)));
    };

    fetchLikedAndDislikedQuotes();
  }, [user]);

  return (
    <section className="user-page">
      <div className="user-page__liked">
        <p className="user-page__p black-shadow">Here you can see all the quotes you liked:</p>
        <ul className="black-shadow user-page__liked-list">
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

      <div className="user-page__disliked">
        <p className="user-page__p white-shadow">Here you can see all the quotes you disliked:</p>
        <ul className="white-shadow user-page__disliked-list">
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
    </section>
  );
};

export default UserPage;
