import { Provider } from 'react-redux';
import { ThemeProvider } from '../contexts/ThemeContext';
import Header from './Header';
import FooterTaskbar from './FooterTaskbar';
import Desktop from '../components/Desktop/Desktop';
import { store } from './store';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Provider store={store}>
          <Header />
          <Desktop />
          <FooterTaskbar />
        </Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
