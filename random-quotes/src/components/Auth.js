import {auth, googleProvider} from '../config/firebase';
import {createUserWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth';
import { useState } from 'react';

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn =async() => {
    try {
    await createUserWithEmailAndPassword(auth, googleProvider);
    } catch (err) {
      console.error(err);
  }}

  const signInWithGoogle =async() => {
    try {
    await signInWithPopup(auth, email, password);
    } catch (err) {
      console.error(err);
  }}

  return (
    <div>
      <input type="email" placeholder="Email" onChange={(e)=> setEmail(e.target.value)}/>
      <input type="password" placeholder="Password" onChange={(e)=> setPassword(e.target.value)} />
      <button onClick={signIn}>Sign In</button>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}