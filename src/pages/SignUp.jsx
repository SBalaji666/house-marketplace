import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import OAuth from '../components/OAuth';
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';
import { ReactComponent as ArrowIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import { async } from '@firebase/util';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();

  const handleChange = ({ target: { value, id } }) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      navigate('/');
    } catch (error) {
      toast.error('Something Went Wrong With Registration');
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome back!</p>
        </header>

        <main>
          <form onSubmit={handleSubmit}>
            <input
              className="nameInput"
              type="text"
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={handleChange}
            />

            <input
              className="emailInput"
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={handleChange}
            />

            <div className="passwordInputDiv">
              <input
                className="passwordInput"
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={handleChange}
              />
              <img
                className="showPassword"
                src={visibilityIcon}
                alt="show password"
                onClick={() => setShowPassword(prev => !prev)}
              />
            </div>

            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>

            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button type="submit" className="signUpButton">
                <ArrowIcon width={34} height={34} fill="#ffffff" />
              </button>
            </div>
          </form>

          <OAuth />

          <Link className="registerLink" to="/sign-in">
            Sign In Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignUp;
