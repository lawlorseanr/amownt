import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const App = ({ username, handleAccess }) => {
  const [linkToken, setLinkToken] = useState(null);

  const generateToken = () => {
    axios.post('http://localhost:8000/api/create_link_token', { username }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        setLinkToken(response.data);
      })
      .catch((error) => {
        console.error('paidLink error: ', error);
      })
  }

  useEffect(() => {
    axios.post('http://localhost:3000/api/user', { username }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        const data = response.data;
        if (data.link_token !== null) {
          setLinkToken(data.link_token);
        } else {
          generateToken(username);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  if (linkToken === null) {
    return <></>;
  }
  return <Link
    username={username}
    linkToken={linkToken}
    handleAccess={handleAccess}
  />;
};

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
const Link = ({ username, linkToken, handleAccess}) => {
  const setTransactions = (username) => {
    axios.post('http://localhost:3000/api/set_transactions', { username })
      .then(() => handleAccess())
      .catch((error) => { throw error; });
  }

  const onSuccess = React.useCallback((public_token, metadata) => {
    // send public_token to server
    axios.post(
      'http://localhost:8000/api/set_access_token',
      { username, public_token }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
      .then(() => setTimeout(setTransactions(username), 1500))
      .catch((error) => console.error(error));

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