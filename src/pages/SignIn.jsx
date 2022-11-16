import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import OAuth from '../components/OAuth';
import { ReactComponent as ArrowIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/svg/visibilityIcon.svg';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const navigate = useNavigate();

  const handleChange = ({ target: { value, id } }) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Bad User Credential');
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

            <div className="signInBar">
              <p className="signInText">Sign In</p>
              <button type="submit" className="signInButton">
                <ArrowIcon width={34} height={34} fill="#ffffff" />
              </button>
            </div>
          </form>

          <OAuth />

          <Link className="registerLink" to="/sign-up">
            Sign Up Instead
          </Link>
        </main>
      </div>
    </>
  );
}

export default SignIn;
