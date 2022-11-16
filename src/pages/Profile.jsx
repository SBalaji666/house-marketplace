import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, updateProfile } from 'firebase/auth';
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  getDoc,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import ListingItem from '../components/ListingItem';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
import { async } from '@firebase/util';

function Profile() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingRef = collection(db, 'listings');

      const q = query(
        listingRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timeStamp', 'desc'),
        limit(5)
      );

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, [auth.currentUser.uid]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const handleChange = ({ target: { value, id } }) => {
    console.log(value, id);
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.name !== name) {
        // Update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update in fireStore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  };

  const handleDelete = async listingId => {
    if (window.confirm('Are yoy sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId));

      const updatedListing = listings.filter(
        listing => listing.id !== listingId
      );
      setListings(updatedListing);
      toast.success('Sucessfull deleted listing');
    }
  };

  const handleEdit = listingId => {
    navigate(`/edit-listing/${listingId}`);
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={handleLogout}>
          logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails(prev => !prev);
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={handleChange}
            />

            <input
              type="email"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={handleChange}
            />
          </form>
        </div>

        <Link className="createListing" to="/create-listing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map(listing => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
