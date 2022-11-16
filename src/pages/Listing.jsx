import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
import { async } from '@firebase/util';

function Listing() {
  const [listing, setListing] = useState({});
  const [loading, setLoading] = useState(true);
  const [shareLinkCopy, setShareLinkCopy] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareLinkCopy(true);

    setTimeout(() => {
      setShareLinkCopy(false);
    }, 2000);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        pagination={{
          clickable: 'true',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        slidesPerView={1}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="shareIconDiv" onClick={handleShare}>
        <img src={shareIcon} alt="share" />
        {shareLinkCopy && <p className="linkCopied">Link Copied!</p>}
      </div>

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className="listingLocation">{listing.loaction}</p>
        <p className="listingType">
          For {listing.type === 'rent' ? 'rent' : 'sale'}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${+listing.regularPrice - +listing.discountedPrice} discount
          </p>
        )}

        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bed'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Paring Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ width: '100%', height: '100%' }}
            center={[+listing.geolocation.lat, +listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[+listing.geolocation.lat, +listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
            className="primaryButton"
          >
            Contact LandLord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
