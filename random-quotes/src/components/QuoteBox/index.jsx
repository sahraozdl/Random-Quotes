import './styles.css';
import { UserContext, UserDispatchContext } from '../../UserContext';
import { useContext } from 'react';

export function QuoteBox({
  id,
  quote,
  author,
  onNewQuoteClick,
  onLikeClick,
  onDislikeClick,
  LikeCount,
  DislikeCount
}) {
  const  user  = useContext(UserContext);
  const setUser = useContext(UserDispatchContext);
  console.table(user);

  function handleLikeClick() {
    setUser(prevState =>{
      if(prevState.dislikedQuotes.includes){
        const updatedDislikedQuotes = prevState.dislikedQuotes.filter(dislikedQuoteId => dislikedQuoteId !== id);
        return {
          ...prevState,
          likedQuotes: [...prevState.likedQuotes, id],
          dislikedQuotes: updatedDislikedQuotes
        }
      }
    } )
    onLikeClick();
  }

  function handleDislikeClick() {
    setUser(prevState =>{
      if(prevState.likedQuotes.includes){
        const updatedLikedQuotes = prevState.likedQuotes.filter(likedQuoteId => likedQuoteId !== id);
        return {
          ...prevState,
          dislikedQuotes: [...prevState.dislikedQuotes, id],
          likedQuotes: updatedLikedQuotes
        }
      }
    } )
    onDislikeClick();
  }

  return (
    <div className="quote-box">
      <p className="quote-box__quote">{quote}</p>
      <span className="quote-box__author">{author}</span>
      <div className="quote-box__btns">
        <div className="quote-box__actions">
        <button
          className="like-btn"
          onClick={handleLikeClick}
          disabled={user.likedQuotes.includes(id)}
        >
          Like {LikeCount} 
          User Liked {user.likedQuotes.includes(id)? 1 :0}
        </button>
        <button
          className="dislike-btn"
          onClick={handleDislikeClick}
          disabled={user.dislikedQuotes.includes(id)}
        >
          Dislike {DislikeCount} 
          User Disliked {user.dislikedQuotes.includes(id)? 1 :0}
        </button>
        </div>
        <button className="new-quote__btn" onClick={onNewQuoteClick}>
          New Quote
        </button>
      </div>
    </div>
  );
}