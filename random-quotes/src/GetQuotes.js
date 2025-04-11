import { db } from "./firebase/config";
import { collection, getDocs } from "firebase/firestore";

export async function getQuotes() {
  const quotesCollectionRef = collection(db, "quotes");
  try {
    const querySnapshot = await getDocs(quotesCollectionRef);
    const quotes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return quotes;
  } catch (error) {
    console.error("❌ Error fetching quotes:", error);
    return [];
  }
}