import "./App.css";
import { quotes as quotesData } from "./quotes";
import { useState } from "react";
import { QuoteBox } from "./components/QuoteBox";
import { Title } from "./components/Title";

function App() {
  const [quotes, setQuotes] = useState(quotesData);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const getRandomQuoteIndex = () => Math.floor(Math.random() * quotes.length);

  function handleLikeClick() {
    setQuotes((prevQuotes) =>
      prevQuotes.map((q, index) =>
        index === quoteIndex
          ? { ...q, likeCount: q.likeCount === 0 ? 1 : 0, dislikeCount: 0 }
          : q
      )
    );
  }

  function handleDislikeClick() {
    setQuotes((prevQuotes) =>
      prevQuotes.map((q, index) =>
        index === quoteIndex
          ? { ...q, dislikeCount: q.dislikeCount === 0 ? 1 : 0, likeCount: 0 }
          : q
      )
    );
  }

  function handleNewQuoteClick() {
    setQuoteIndex(getRandomQuoteIndex());
  }
  return (
    <div className="App">
      <Title>Random Quotes</Title>
      <QuoteBox
        quote={quotes[quoteIndex].quote}
        author={quotes[quoteIndex].author}
        onNewQuoteClick={handleNewQuoteClick}
        onLikeClick={handleLikeClick}
        onDislikeClick={handleDislikeClick}
        likeCount={quotes[quoteIndex].likeCount}
        dislikeCount={quotes[quoteIndex].dislikeCount}
      />
    </div>
  );
}

export default App;
