import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const App = ({ handleAccess }) => {
  const [linkToken, setLinkToken] = useState(null);

  const generateToken = () => {
    axios.post('http://localhost:8000/api/create_link_token', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        setLinkToken(response.data.link_token);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  useEffect(() => {
    generateToken();
  }, []);

  return linkToken != null ? <Link handleAccess={handleAccess} linkToken={linkToken} /> : <></>;
};

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
const Link = ({ handleAccess, linkToken}) => {
  const onSuccess = React.useCallback((public_token, metadata) => {
    // send public_token to server
    axios.post(
      'http://localhost:8000/api/set_access_token',
      {public_token}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        handleAccess(response.data.access_token);
      })
      .catch((error) => {
        console.error('Error exchanging token');
      });

  }, []);
  const config = {
    token: linkToken,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);
  return (
    <button onClick={() => open()} disabled={!ready}>
      Link account
    </button>
  );
};

export default App;