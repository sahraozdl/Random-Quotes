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
  const { user } = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [likedByUser, setLikedByUser] = useState(false);
  const [dislikedByUser, setDislikedByUser] = useState(false);

  const [userMessage, setUserMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Reference to the specific quote document in Firestore
  const quoteDocRef = doc(db, "quotes", id);
  console.log("Current user:", user);
  console.log("Current quote:", quote);

  const getQuoteCounts = async () => {
    const updatedDoc = await getDoc(quoteDocRef);
    if (updatedDoc.exists()) {
      const updatedData = updatedDoc.data();
      setLikeCount(updatedData.likedBy?.length || 0);
      setDislikeCount(updatedData.dislikedBy?.length || 0);
    }
  };

  // Fetchs counts when the component mounts or when the quote changes
  useEffect(() => {
    // Resets the like/dislike states and fetch new counts for the new quote
    setLikedByUser(false);
    setDislikedByUser(false);
    getQuoteCounts();

    // Checks if the user has already liked or disliked this quote
    if (user?.id) {
      const updatedDoc = getDoc(quoteDocRef).then((updatedDoc) => {
        if (updatedDoc.exists()) {
          const updatedData = updatedDoc.data();
          setLikedByUser(updatedData.likedBy?.includes(user.id));
          setDislikedByUser(updatedData.dislikedBy?.includes(user.id));
        }
      });
    }
  }, [id, user]);
  // Handle like button click
  async function handleLikeClick() {
    if (!user || !user.id) {
      console.log("User is not logged in");
      setErrorMessage("User is not logged in.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // Clear message after 3 seconds
      return;
    }

    if (likedByUser) {
      //The message doesnt work either.Because the button disabled.
      console.log("You have already liked this quote.");
      setUserMessage("You have already liked this quote.");
      setTimeout(() => {
        setUserMessage("");
      }, 3000); // Clear message after 3 seconds
      return;
    }

    dispatch({ type: UserActionTypes.UpdateLikedQuotes, payload: { id } });

    try {
      await updateDoc(quoteDocRef, {
        likedBy: arrayUnion(user.id),
        dislikedBy: dislikedByUser ? arrayRemove(user.id) : [],
      });
      await updateDoc(doc(db, "users", user.id), {
        likedQuotes: arrayUnion(id),
        dislikedQuotes: arrayRemove(id),
      });

      getQuoteCounts();

      setLikedByUser(true);
    } catch (err) {
      setErrorMessage("Error liking quote. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // Clear message after 3 seconds
      console.error("Error liking quote:", err);
    }
  }
  // Handle dislike button click
  async function handleDislikeClick() {
    if (!user || !user.id) {
      console.log("User is not logged in");
      setErrorMessage("User is not logged in.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000); // Clear message after 3 seconds
      return;
    }

    if (dislikedByUser) {
      console.log("You have already disliked this quote.");
      setUserMessage("You have already disliked this quote.");
      setTimeout(() => {
        setUserMessage("");
      }, 3000); // Clear message after 3 seconds
      return;
    }

    dispatch({ type: UserActionTypes.UpdateDislikedQuotes, payload: { id } });

    try {
      await updateDoc(quoteDocRef, {
        dislikedBy: arrayUnion(user.id),
        likedBy: likedByUser ? arrayRemove(user.id) : [],
      });

      await updateDoc(doc(db, "users", user.id), {
        dislikedQuotes: arrayUnion(id),
        likedQuotes: arrayRemove(id),
      });

      getQuoteCounts();

      setDislikedByUser(true);
    } catch (err) {
      setErrorMessage("Error disliking quote. Please try again.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      console.error("Error disliking quote:", err);
    }
  }

  return (
    <div className="quote-container">
      <p className="quote">{quote}</p>
      <span className="quote text-right">{author}</span>
      <div className="flex flex-row-reverse justify-between py-4">
        <div className="flex justify-center items-center gap-2 py-0 px-4">
          <button
            className="btn-yellow"
            onClick={handleLikeClick}
            disabled={likedByUser} // Disable if the user already liked the quote
          >
            {likeCount} Like
          </button>
          <button
            className="btn-yellow"
            onClick={handleDislikeClick}
            disabled={dislikedByUser} // Disable if the user already disliked the quote
          >
            {dislikeCount} Dislike
          </button>
        </div>
        <button className="btn-yellow" onClick={onNewQuoteClick}>
          New Quote
        </button>
      </div>
      <span className="messages">{errorMessage}</span>
      <span className="messages">{userMessage}</span>
    </div>
  );
}
