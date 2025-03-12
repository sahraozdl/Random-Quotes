import style from './styles.css';
export function QuoteBox({ quote, author, onNewQuoteClick, onLikeClick, onDislikeClick, likeCount, dislikeCount }) {
  return (
    /* <></> is called Fragmet element and it's used to add a parent wrapper around element on the same level */
    <>
      <div className='quote-box'>
        <p className='quote-box__quote'>{quote}</p>
        <span className='quote-box__author'>{author}</span>
        <div className='quote-box__actions'>
          <button 
          className="like-btn"
          onClick={onLikeClick}>Like {likeCount ?? 0}</button>
          <button 
          className="dislike-btn"
          onClick={onDislikeClick}>Dislike {dislikeCount ?? 0} </button>
          <button className='new-quote__btn' onClick={onNewQuoteClick}>New Quote</button>
        </div>
      </div>
    </>
  );
}
