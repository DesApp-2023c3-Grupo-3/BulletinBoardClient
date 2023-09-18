import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ScreenClient from './components/ScreenClient/ScreenClient';
import AdminWeb from './components/AdminWeb/AdminWeb';
import Avisos from './components/AdminWeb/pages/Avisos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>App</h1>
            </div>
          }
        />
        <Route path="/screen" element={<ScreenClient />} />
        <Route path="/admin" element={<AdminWeb />} />
        <Route path="/admin/avisos" element={<Avisos />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
