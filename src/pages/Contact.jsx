import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useSearchParams } from 'react-router-dom';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function Contact() {
  const [message, setMessage] = useState('');
  const [landLord, setLandLord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandLoard = async () => {
      const docRef = doc(db, 'users', params.landLordId);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandLord(docSnap.data());
        setLoading(false);
      } else {
        toast.error('Could not get landlord data');
      }
    };

    getLandLoard();
  }, [params.landLordId]);

  const handleChange = ({ target: { value } }) => {
    setMessage(value);
  };

  if (loading) return <Spinner />;

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact LandLord</p>
      </header>

      {landLord !== null && (
        <main>
          <div className="contactLandLord">
            <p className="landlordName">Contact : {landLord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                className="textarea"
                onChange={handleChange}
              />
            </div>

            <a
              href={`mailto:${landLord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
