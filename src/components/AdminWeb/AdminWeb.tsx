import './AdminWeb.sass';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Usuarios from './Pages/Usuarios/Usuarios';
import Comisiones from './Pages/Comisiones/Comisiones';
import Pantallas from './Pages/Pantallas/Pantallas';
import Avisos from './Pages/Avisos/Avisos';
import SearchTermProvider from './context/SearchTerm/SearchTermProvider';
import TableProvider from './context/TableProvider';
import UserProvider from './context/UserProvider';
import Mapas from './Pages/Mapas/Mapas';

function AdminWeb() {
  return (
    <section
      id="SectionWeb"
      className="h-screen flex flex-row dark text-foreground bg-background"
    >
      <UserProvider>
        <Navbar />
        <TableProvider>
          <SearchTermProvider>
            <Routes>
              <Route path="/advertising" element={<Avisos />} />
              <Route path="/comission" element={<Comisiones />} />
              <Route path="/screen" element={<Pantallas />} />
              <Route path="/map" element={<Mapas />} />
              <Route path="/user" element={<Usuarios />} />
            </Routes>
          </SearchTermProvider>
        </TableProvider>
      </UserProvider>
    </section>
  );
}

export default AdminWeb;
