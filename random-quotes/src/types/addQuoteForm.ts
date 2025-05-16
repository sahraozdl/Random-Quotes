import { QuoteData } from "./Quote";
export interface AddQuoteFormProps {
  onQuoteAdded?: (quote: QuoteData) => void;
}