import { QuoteBox } from "../QuoteBox";
import { Title } from "../Title";
import { quotes as quotesData } from "../../quotes";
import { useState } from "react";
import "./index.css";

export const Home = () => {
   const [quotes, setQuotes] = useState(quotesData);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [likeCount, setLikeCount] = useState(0); // Add likeCount state
    const [dislikeCount, setDislikeCount] = useState(0); // Add dislikeCount state
    const getRandomQuoteIndex = () => Math.floor(Math.random() * quotes.length);
  
    function handleLikeClick() {
      setLikeCount(prevCount => prevCount + 1);
    }
  
    function handleDislikeClick() {
      setDislikeCount(prevCount => prevCount + 1);
    }
  
    function handleNewQuoteClick() {
      setQuoteIndex(getRandomQuoteIndex());
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
            onLikeClick={handleLikeClick}
            onDislikeClick={handleDislikeClick}
            LikeCount={likeCount}
            DislikeCount={dislikeCount}
          />
          </div>
   </div>
  );
}