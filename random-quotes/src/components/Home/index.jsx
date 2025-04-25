import { QuoteBox } from "../QuoteBox";
import { Title } from "../Title";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export const Home = () => {
  const [quotes, setQuotes] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Fetch the list of quotes from Firestore
  const quoteList = collection(db, "quotes");

  useEffect(() => {
    const getQuoteList = async () => {
      try {
        const data = await getDocs(quoteList);
        const quotes = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setQuotes(quotes);
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
      } catch (err) {
        console.error("Error getting quotes:", err);
      }
    };

    getQuoteList();
  }, []);

  const getRandomQuoteIndex = () => Math.floor(Math.random() * quotes.length);

  function handleNewQuoteClick() {
    setQuoteIndex(getRandomQuoteIndex());
  }

  if (quotes.length === 0) {
    return <p>Loading quotes...</p>;
  }

  return (
    <div className="container" >
      <div className="inner-container">
        <Title>Random Quotes</Title>
        <QuoteBox
          id={quotes[quoteIndex].id}
          quote={quotes[quoteIndex].quote}
          author={quotes[quoteIndex].author}
          onNewQuoteClick={handleNewQuoteClick}
        />
      </div>
    </div>
  );
};