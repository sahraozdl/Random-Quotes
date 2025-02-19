export function QuoteBox({ quote, author, onNewQuoteClick }) {
  return (
    /* <></> is called Fragmet element and it's used to add a parent wrapper around element on the same level */
    <>
      <div>
        <p>{quote}</p>
        <span>{author}</span>
        <div>
          <button>Like {0}</button>
          <button>Dislike {1} </button>
        </div>
      </div>
      <button onClick={onNewQuoteClick}>New Quote</button>
    </>
  );
}
