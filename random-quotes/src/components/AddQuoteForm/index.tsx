import { useState, useEffect, useContext } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router";
import { Quote } from "lucide-react";
import { AddQuoteFormProps } from "../../types/addQuoteForm";

export default function AddQuoteForm({ onQuoteAdded }: AddQuoteFormProps) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryRef = collection(db, "categories");
        const snapshot = await getDocs(categoryRef);
        const data = snapshot.docs.map((doc) => doc.data().name);
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) {
      setMessage("You must be logged in to add a quote.");
      return;
    }

    try {
      setLoading(true);

      const quoteRef = await addDoc(collection(db, "quotes"), {
        quote: quoteText,
        author,
        category,
        userId: user.id,
        createdAt: serverTimestamp(),
        likedBy: [],
        dislikedBy: [],
      });

      await updateDoc(doc(db, "quotes", quoteRef.id), {
        id: quoteRef.id,
      });

      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        addedQuotes: [...(user.addedQuotes || []), quoteRef.id],
      });

      setMessage("Quote added!");

      onQuoteAdded &&
        onQuoteAdded({
          id: quoteRef.id,
          quote: quoteText,
          author,
          category,
        });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Error adding quote:", err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 text-left">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Quote className="text-yellow-500 w-5 h-5" />
        Add a New Quote
      </h2>

      <div className="flex flex-col">
        <label
          htmlFor="quoteText"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Quote:
        </label>
        <textarea
          id="quoteText"
          className="input"
          placeholder="Quote text"
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="author"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Author:
        </label>
        <input
          id="author"
          className="input"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="category"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Category:
        </label>
        <select
          id="category"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-yellow-400 text-blue-950 font-bold rounded-lg shadow-md hover:text-yellow-200 hover:bg-indigo-950 w-1/2 py-2"
      >
        {loading ? "Adding..." : "Add Quote"}
      </button>

      {message && <p className="text-red-600">{message}</p>}
    </form>
  );
}
