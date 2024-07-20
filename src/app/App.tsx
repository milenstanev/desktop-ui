import React from 'react';
import {Provider} from 'react-redux';
import './App.css';
import Header from './Header';
import FooterTaskbar from './FooterTaskbar';
import Desktop from '../features/Desktop/Desktop';
import {store} from "./store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Header />
        <Desktop />
        <FooterTaskbar />
      </Provider>
    </div>
  );
}

export default App;
