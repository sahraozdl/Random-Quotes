import { QuoteBox } from "../QuoteBox";
import { Title } from "../Title";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import "./index.css";

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
          id: doc.id, // Add document ID to each quote for unique reference
        }));
        setQuotes(quotes);
        // Set a random quote when data is fetched
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
      } catch (err) {
        console.error("Error getting quotes:", err);
      }
    };

    getQuoteList();
  }, []);

  // Function to get a random quote index
  const getRandomQuoteIndex = () => Math.floor(Math.random() * quotes.length);

  // Function to handle clicking on a new quote
  function handleNewQuoteClick() {
    setQuoteIndex(getRandomQuoteIndex());
  }

  // If quotes are still being fetched, show a loading message
  if (quotes.length === 0) {
    return <p>Loading quotes...</p>;
  }

  return (
    <div className="home">
      <div className="home__container">
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
