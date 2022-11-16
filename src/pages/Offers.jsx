import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { async } from '@firebase/util';
import ListingItem from '../components/ListingItem';

function Offers() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timeStamp', 'desc'),
          limit(10)
        );

        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];

        querySnap.forEach(doc => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListing(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };

    fetchListings();
  }, []);

  const onMoreFetchListings = async () => {
    try {
      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timeStamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      );

      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListing(prev => [...prev, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading ? (
        <Spinner />
      ) : listing && listing.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listing.map(listing => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />

          {lastFetchedListing && (
            <p className="loadMore" onClick={onMoreFetchListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
}

export default Offers;
