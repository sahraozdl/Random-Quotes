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

  const [updatedLikeCount, setUpdatedLikeCount] = useState(0);
  const [updatedDislikeCount, setUpdatedDislikeCount] = useState(0);

  // Reference to the specific quote document in Firestore
  const quoteDocRef = doc(db, "quotes", id);
  console.log("Current user:", user);

  const getQuoteCount = async () => {
    const updatedDoc = await getDoc(quoteDocRef);
    if (updatedDoc.exists()) {
      const updatedData = updatedDoc.data();
      setUpdatedLikeCount(updatedData.likedBy?.length || 0); // Set the updated likeCount from likedBy array length
      setUpdatedDislikeCount(updatedData.dislikedBy?.length || 0); // Set the updated dislikeCount from dislikedBy array length
    }
  };

  // Handle like button click
  async function handleLikeClick() {
    if (!user || !user.id) {
      console.log("User is not logged in");
      return;
    }

    // Dispatch action to update liked quotes in state
    dispatch({ type: UserActionTypes.UpdateLikedQuotes, payload: { id } });

    try {
      // Add the user ID to likedBy and update likeCount
      await updateDoc(quoteDocRef, {
        likedBy: arrayUnion(user.id), // ✅ Use user.id
        dislikedBy: user.dislikedQuotes.includes(quote.id)
          ? arrayRemove(user.id) // Remove from dislikedBy if present
          : [], // ✅ Remove from dislikedBy if not
      });

      // Get the updated like count from Firestore
      getQuoteCount();
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

    // Dispatch action to update disliked quotes in state
    dispatch({ type: UserActionTypes.UpdateDislikedQuotes, payload: { id } });

    try {
      // Add the user ID to dislikedBy and update dislikeCount
      await updateDoc(quoteDocRef, {
        dislikedBy: arrayUnion(user.id),
        likedBy: user.likedQuotes.includes(quote.id)
          ? arrayRemove(user.id)
          : [],
      });

      // Get the updated like count from Firestore
      getQuoteCount();
    } catch (err) {
      console.error("Error disliking quote:", err);
    }
  }
  useEffect(() => {
    getQuoteCount();
  }, []);

  return (
    <div className="quote-box">
      <p className="quote-box__quote">{quote}</p>
      <span className="quote-box__author">{author}</span>
      <div className="quote-box__btns">
        <div className="quote-box__actions">
          <button
            className="btn"
            onClick={handleLikeClick}
            disabled={user?.likedQuotes?.includes(id)}
          >
            {updatedLikeCount}
          </button>
          <button
            className="btn"
            onClick={handleDislikeClick}
            disabled={user?.dislikedQuotes?.includes(id)}
          >
            {updatedDislikeCount}
          </button>
        </div>
        <button className="btn" onClick={onNewQuoteClick}>
          New
        </button>
      </div>
    </div>
  );
}
