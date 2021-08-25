import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const App = ({ handleAccess }) => {
  const [linkToken, setLinkToken] = useState(null);

  const generateToken = () => {
    axios.post('http://localhost:8000/api/create_link_token')
      .then((response) => {
        setLinkToken(response.data.link_token);
      })
  }

  useEffect(() => {
    generateToken();
  }, []);

  console.log(linkToken);
  return linkToken != null ? <Link linkToken={linkToken} /> : <></>;
};

// LINK COMPONENT
// Use Plaid Link and pass link token and onSuccess function
// in configuration to initialize Plaid Link
const Link = (props) => {
  const onSuccess = React.useCallback((public_token, metadata) => {
    // send public_token to server
    axios.post(
      'http://localhost:8000/api/set_access_token',
      public_token, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        handleAccess(response);
      })
      .catch((error) => {
        console.error('Error exchanging token');
      });

  }, []);
  const config = {
    token: props.linkToken,
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