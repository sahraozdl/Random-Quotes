import { UserContext} from '../../UserContext';
import { useContext } from 'react';
import { quotes } from '../../quotes';
import './index.css';

export const UserPage = () => {
  const  user  = useContext(UserContext);
  const likedQuoteIds = user.likedQuotes;
  const dislikedQuoteIds = user.dislikedQuotes; 
  const likedQuotes = quotes.filter(quote => likedQuoteIds.includes(quote.id));
  const dislikedQuotes = quotes.filter(quote => dislikedQuoteIds.includes(quote.id));

  return (
    <section className='user-page'>
      <div className='user-page__liked'>
      <p className='user-page__p black-shadow'>Here you can see all the quotes you liked:</p>
      <ul className='black-shadow user-page__liked-list'>
        {likedQuotes.map(quote => (
          <li key={quote.id}>
            <p>{quote.quote}</p>
            <span>{quote.author}</span>
            <hr/>
            </li>
        ))}
      </ul>
      </div>
      <div className='user-page__disliked'>
      <p className='user-page__p white-shadow'>Here you can see all the quotes you disliked:</p>  
      <ul className='user-page__disliked-list white-shadow'>
        {dislikedQuotes.map(quote => (
          <li key={quote.id}>
            <p>{quote.quote}</p>
            <span>{quote.author}</span>
            <hr/>
            </li>
        ))}
      </ul>
      </div>
    </section>
  );
};