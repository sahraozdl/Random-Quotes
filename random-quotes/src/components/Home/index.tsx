import { QuoteBox } from "../QuoteBox";
import { Title } from "../Title/index";
import { useState, useEffect, useContext } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Modal from "../Modal/index";
import AddQuoteForm from "../AddQuoteForm/index";
import { UserContext } from "../../UserContext";

export const Home = () => {
  const { user } = useContext(UserContext);
  const [quotes, setQuotes] = useState([]);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const quoteList = collection(db, "quotes");

  useEffect(() => {
    const getQuoteList = async () => {
      try {
        const data = await getDocs(quoteList);
        const quotes = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setQuotes(quotes);
        setQuoteIndex(Math.floor(Math.random() * quotes.length));
      } catch (err) {
        console.error("Error getting quotes:", err);
      }
    };

    getQuoteList();
  }, []);

  const getRandomQuoteIndex = () => Math.floor(Math.random() * quotes.length);

  function handleNewQuoteClick() {
    setQuoteIndex(getRandomQuoteIndex());
  }

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  if (quotes.length === 0) {
    return <p>Loading quotes...</p>;
  }

  return (
    <div className="bg-white rounded-lg p-10 my-12 mx-auto max-h-full w-3/4">
      <div className="relative bg-indigo-400 border-indigo-950 border-4 rounded-lg p-5 m-auto max-w-full h-96">
        <Title>Random Quotes</Title>
        <QuoteBox
          id={quotes[quoteIndex].id}
          quote={quotes[quoteIndex].quote}
          author={quotes[quoteIndex].author}
          onNewQuoteClick={handleNewQuoteClick}
        />
        {user.email && (
          <button
            className="absolute right-4 bottom-4 bg-indigo-800 text-white p-2 rounded-2xl hover:bg-indigo-900"
            onClick={handleOpenModal}
          >
            + Quote
          </button>
        )}
      </div>
      {user.email && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <AddQuoteForm onQuoteAdded={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};
