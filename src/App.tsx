import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import './components/AdminWeb/AdminWeb.sass';
import ScreenClient from './components/ScreenClient/components/ScreenClient';
import AdminWeb from './components/AdminWeb/AdminWeb';
import LoginScreen from './components/LoginScreen/LoginScreen';
import { useState } from 'react';

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = 'Cartelera UNAHUR';
        break;
      case '/screen':
        document.title = 'Cartelera UNAHUR | Preview';
        break;
      default:
        document.title = 'Cartelera UNAHUR | Administrador';
    }
  }, [location]);

  return null;
}

function App() {
  const [currentScreenId, setCurrentScreenId] = useState(1);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen setScreenId={setCurrentScreenId} />} />
        <Route path="/screen" element={<ScreenClient screenId={currentScreenId} />} />
        <Route path="/admin" element={<Navigate to="/admin/advertising" />} />
        <Route path="/admin/*" element={<AdminWeb />}/>
      </Routes>
      <TitleUpdater />
    </BrowserRouter>
  );
}

export default App;
