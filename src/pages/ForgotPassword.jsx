import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleChange = ({ target }) => {
    setEmail(target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const auth = getAuth();

      await sendPasswordResetEmail(auth, email);

      toast.success('Email was sent');
    } catch (error) {
      toast.error('Could not send reset email');
    }

    setEmail('');
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            value={email}
            className="emailInput"
            placeholder="Enter email"
            onChange={handleChange}
          />
          <Link to="/sign-in" className="forgotPasswordLink">
            Sign In
          </Link>

          <div className="signInBar">
            <p className="signInText">Send Reset Link</p>

            <button type="submit" className="signInButton">
              <ArrowRightIcon fill="#ffffff" width={34} height={34} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
