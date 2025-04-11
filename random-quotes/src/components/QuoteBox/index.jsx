import "./styles.css";
import {
  UserActionTypes,
  UserContext,
  UserDispatchContext,
} from "../../UserContext";
import React, { useContext, useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export function QuoteBox({ id, quote, author, onNewQuoteClick }) {
  const user = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [likedByUser, setLikedByUser] = useState(false);
  const [dislikedByUser, setDislikedByUser] = useState(false);

  // Reference to the specific quote document in Firestore
  const quoteDocRef = doc(db, "quotes", id);
  console.log("Current user:", user);

  const getQuoteCounts = async () => {
    const updatedDoc = await getDoc(quoteDocRef);
    if (updatedDoc.exists()) {
      const updatedData = updatedDoc.data();
      setLikeCount(updatedData.likedBy?.length || 0);
      setDislikeCount(updatedData.dislikedBy?.length || 0);
    }
  };

  // Fetch counts when the component mounts or when the quote changes
  useEffect(() => {
    // Reset the like/dislike states and fetch new counts for the new quote
    setLikedByUser(false);
    setDislikedByUser(false);
    getQuoteCounts();

    // Check if the user has already liked or disliked this quote
    if (user?.id) {
      const updatedDoc = getDoc(quoteDocRef).then((updatedDoc) => {
        if (updatedDoc.exists()) {
          const updatedData = updatedDoc.data();
          setLikedByUser(updatedData.likedBy?.includes(user.id));
          setDislikedByUser(updatedData.dislikedBy?.includes(user.id));
        }
      });
    }
  }, [id, user]); // Re-fetch when the quote ID or user changes

  // Handle like button click
  async function handleLikeClick() {
    if (!user || !user.id) {
      console.log("User is not logged in");
      return;
    }

    if (likedByUser) {
      console.log("You have already liked this quote.");
      return;
    }

    // Dispatch action to update liked quotes in state
    dispatch({ type: UserActionTypes.UpdateLikedQuotes, payload: { id } });

    try {
      // Add the user ID to likedBy and update likeCount globally
      await updateDoc(quoteDocRef, {
        likedBy: arrayUnion(user.id),
        dislikedBy: dislikedByUser
          ? arrayRemove(user.id) // Remove from dislikedBy if the user disliked the quote
          : [],
      });
      await updateDoc(doc(db, "users", user.id), {
        likedQuotes: arrayUnion(id),
        dislikedQuotes: arrayRemove(id),
      });

      // Update the global like and dislike counts
      getQuoteCounts();

      // Update local state to reflect the user's action
      setLikedByUser(true);
    } catch (err) {
      console.error("Error liking quote:", err);
    }
  }
  // Handle dislike button click
  async function handleDislikeClick() {
    if (!user || !user.id) {
      console.log("User is not logged in");
      return;
    }

    if (dislikedByUser) {
      console.log("You have already disliked this quote.");
      return;
    }

    // Dispatch action to update disliked quotes in state
    dispatch({ type: UserActionTypes.UpdateDislikedQuotes, payload: { id } });

    try {
      // Add the user ID to dislikedBy and update dislikeCount globally
      await updateDoc(quoteDocRef, {
        dislikedBy: arrayUnion(user.id),
        likedBy: likedByUser ? arrayRemove(user.id) : [],
      });

      await updateDoc(doc(db, "users", user.id), {
        dislikedQuotes: arrayUnion(id),
        likedQuotes: arrayRemove(id),
      });

      // Update the global like and dislike counts
      getQuoteCounts();

      // Update local state to reflect the user's action
      setDislikedByUser(true);
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
            disabled={likedByUser}  // Disable if the user already liked the quote
          >
            {likeCount} Like
          </button>
          <button
            className="btn"
            onClick={handleDislikeClick}
            disabled={dislikedByUser}  // Disable if the user already disliked the quote
          >
            {dislikeCount} Dislike
          </button>
        </div>
        <button className="btn" onClick={onNewQuoteClick}>
          New Quote
        </button>
      </div>
    </div>
  );
}