import { Provider } from 'react-redux';
import './App.css';
import ImageView from './components/imagePreview/imageView';
import { store } from './redux/store';
import Toolbox from './components/header/header';
import { CanvasProvider } from './contexts/canvasContext';

import SideMenu from './components/sideMenu/sideMenu';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <CanvasProvider>
          <Toolbox />
          <div className="flex">
            <div className="viewParent">
              <ImageView />
            </div>
            <SideMenu />
          </div>
        </CanvasProvider>
      </Provider>
    </div>
  );
}

export default App;
