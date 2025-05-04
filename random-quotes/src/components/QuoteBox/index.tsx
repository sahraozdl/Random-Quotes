import {
  UserActionTypes,
  UserContext,
  UserDispatchContext,
  User,
} from "../../UserContext";
import { useContext, useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Button } from "../Button";
import { useNavigate, useParams } from "react-router";
import { QuoteData } from "../types/Quote";

interface QuoteBoxProps extends QuoteData {
  onNewQuoteClick: () => void;
}

export function QuoteBox({ id, quote, author, onNewQuoteClick, category }: QuoteBoxProps) {
  const { user } = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [likedByUser, setLikedByUser] = useState(false);
  const [dislikedByUser, setDislikedByUser] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const { id: quoteIdFromParams } = useParams();

  const isDetailPage = quoteIdFromParams === id;
  const quoteDocRef = doc(db, "quotes", id);


  const getQuoteCounts = async () => {
    const updatedDoc = await getDoc(quoteDocRef);
    if (updatedDoc.exists()) {
      const updatedData = updatedDoc.data();
      setLikeCount(updatedData.likedBy?.length || 0);
      setDislikeCount(updatedData.dislikedBy?.length || 0);
    }
  };

  useEffect(() => {

    getQuoteCounts();
    if (user?.id) {
      getDoc(quoteDocRef).then((updatedDoc) => {
        if (updatedDoc.exists()) {
          const updatedData = updatedDoc.data();
          setLikedByUser(updatedData.likedBy?.includes(user.id));
          setDislikedByUser(updatedData.dislikedBy?.includes(user.id));
        }
      });
    }
  }, [id, user]);

  async function handleLikeClick() {
    if (!user || !user.id) {
      setErrorMessage("User is not logged in.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    if (dispatch) {
      dispatch({ type: UserActionTypes.UpdateLikedQuotes, payload: { id } });
    }

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
      setErrorMessage("Error liking quote");
      console.error("Error liking quote:", err);
    }
  }

  async function handleDislikeClick() {
    if (!user || !user.id) {
      setErrorMessage("User is not logged in.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    if (dispatch) {
      dispatch({ type: UserActionTypes.UpdateDislikedQuotes, payload: { id } });
    }

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
      setErrorMessage("Error disliking quote:");
      console.error("Error disliking quote:", err);
    }
  }

  return (
    <div className="flex flex-col justify-evenly h-4/5 px-1 font-normal">
      <p className="text-xl text-white drop-shadow-3xl m-0 py-0 px-4 font-semibold">
        {quote}
      </p>

      <div className="text-right px-4">
        <span className="text-xl text-white drop-shadow-3xl font-semibold">
          {author}
        </span>
      </div>

      {category && (
        <div className="mt-2 px-4">
          <p className="text-xs italic text-gray-500">
            Category: {category}
          </p>
        </div>
      )}

      <div className="flex flex-row-reverse justify-between items-center py-4">
        <div className="flex justify-center items-center gap-2 px-4">
          <Button
            title={`${likeCount} Like`}
            onClick={handleLikeClick}
            disabled={likedByUser}
          />
          <Button
            title={`${dislikeCount} Dislike`}
            onClick={handleDislikeClick}
            disabled={dislikedByUser}
          />
        </div>

        {!isDetailPage && (
          <Button
            title="View Details"
            onClick={() => navigate(`/quotes/${id}`)}
          />
        )}
      </div>

      {!isDetailPage && (
        <div className="p-0 m-0 text-left">
          <Button title="New Quote" onClick={onNewQuoteClick} />
        </div>
      )}

      {errorMessage && (
        <div className="p-4">
          <p className="text-yellow-400 text-lg font-bold drop-shadow-3xl">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}