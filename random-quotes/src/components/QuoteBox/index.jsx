import "./styles.css";
import { UserActionTypes, UserContext, UserDispatchContext } from "../../UserContext";
import { useContext } from "react";
import { doc, setDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../firebase/config";

export function QuoteBox({
  id,
  quote,
  author,
  onNewQuoteClick,
  LikeCount,
  DislikeCount,
}) {
  const user = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);

  // Reference to the specific quote document in Firestore
  const quoteDocRef = doc(db, "quotes", id);

  // Handle like button click
  async function handleLikeClick() {
    if (!user) {
      console.log("User is not logged in");
      return;
    }

    // Dispatch action to update liked quotes in state
    dispatch({ type: UserActionTypes.UpdateLikedQuotes, payload: { id } });
    console.log(user.id);
    try {
      // Add the user ID to likedBy and update likeCount
      await updateDoc(quoteDocRef, {
        likedBy: arrayUnion(user.id),
        likeCount: increment(1), // Increment like count by 1
      });
    } catch (err) {
      console.error("Error liking quote:", err);
    }
  }

  // Handle dislike button click
  async function handleDislikeClick() {
    if (!user) {
      console.log("User is not logged in");
      return;
    }

    // Dispatch action to update disliked quotes in state
    dispatch({ type: UserActionTypes.UpdateDislikedQuotes, payload: { id } });
    console.log(user.id);
    try {
      // Add the user ID to dislikedBy and update dislikeCount
      await updateDoc(quoteDocRef, {
        dislikedBy: arrayUnion(user.id),
        dislikeCount: increment(1), // Increment dislike count by 1
      });
    } catch (err) {
      console.error("Error disliking quote:", err);
    }
  }

  return (
    <div className="quote-box">
      <p className="quote-box__quote">{quote}</p>
      <span className="quote-box__author">{author}</span>
      <div className="quote-box__btns">
        <div className="quote-box__actions">
          <button
            className="btn"
            onClick={handleLikeClick}
            disabled={id && user?.likedQuotes?.includes(id)}
          >
            Like {LikeCount}
            {user?.likedQuotes?.includes(id) ? "(Liked)" : "(Not Liked)"}
          </button>
          <button
            className="btn"
            onClick={handleDislikeClick}
            disabled={id && user?.dislikedQuotes?.includes(id)}
          >
            Dislike {DislikeCount}
            {user?.dislikedQuotes?.includes(id) ? "(Disliked)" : "(Not Disliked)"}
          </button>
        </div>
        <button className="btn" onClick={onNewQuoteClick}>
          New Quote
        </button>
      </div>
    </div>
  );
}
