import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = process.env.REACT_APP_CLIENT_ID;

root.render(
  <React.StrictMode>
    <Provider store={store}>
<GoogleOAuthProvider clientId={clientId}>
      <App />
</GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);

