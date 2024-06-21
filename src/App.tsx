import { Provider } from 'react-redux';
import './App.css';
import ImageView from './components/imagePreview/imageView';
import { store } from './redux/store';
import Header from './components/header/header';
import { CanvasProvider } from './contexts/canvasContext';
import SideMenu from './components/sideMenu/sideMenu';

function App() {
  return (
    <div className="App">
      {/* Redux Provider wrapping the entire application to provide access to Redux store */}
      <Provider store={store}>
        {/* Canvas Provider wrapping components that interact with canvas-related context */}
        <CanvasProvider>
          {/* Header component displaying the top navigation or branding */}
          <Header />

          {/* Flex container to layout ImageView and SideMenu horizontally */}
          <div className="flex">
            {/* Container for ImageView component */}
            <div className="viewParent">
              <ImageView />
            </div>

            {/* SideMenu component for displaying drawing tools, settings, and layer management */}
            <SideMenu />
          </div>
        </CanvasProvider>
      </Provider>
    </div>
  );
}

export default App;
