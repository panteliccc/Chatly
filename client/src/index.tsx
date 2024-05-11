import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from "./Context/Provider"
import { Toaster } from './Components/ui/toaster';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <ChatProvider>
        <App/>
        <Toaster />
      </ChatProvider>
    </React.StrictMode>
  </BrowserRouter>

);
