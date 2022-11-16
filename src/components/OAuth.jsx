import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/svg/googleIcon.svg';
import { async } from '@firebase/util';

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //   Check for user
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      //   If user,, doen't exist create user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
      }

      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('Invalid ');
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === '/sign-in' ? 'in' : 'up'} with</p>
      <button className="socialIconDiv" onClick={handleGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="google" />
      </button>
    </div>
  );
}

export default OAuth;
