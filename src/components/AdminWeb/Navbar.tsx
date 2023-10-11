import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import adminPicture from './assets/admin.png';

function Navbar() {
  const [navDeployed, setNavDeployed] = useState(false);

  const switchNavbar = () => {
    setNavDeployed(!navDeployed);
  };

  return (
    <nav
      className={
        'fixed md:relative h-screen px-12 py-8 flex flex-col gap-2 ' +
        (navDeployed ? 'translate-x-[-100%]' : 'translate-x-[0%]')
      }
    >
      <button
        className={'md:hidden absolute cursor-pointer right-[-2rem]'}
        onClick={switchNavbar}
      >
        X
      </button>
      <div className="flex items-center gap-4 bg-white border-white rounded-[10rem] pr-12 mb-16">
        <span className="aspect-square h-16 overflow-hidden rounded-[10rem] p-[0.25rem]">
          <img src={adminPicture} alt="User avatar" />
        </span>
        <h3 className="font-semibold itim">Administrador</h3>
      </div>
      <NavLink to="/admin/advertising">Avisos</NavLink>
      <NavLink to="/admin/comission">Comisiones</NavLink>
      <NavLink to="/admin/screen">Pantallas</NavLink>
      <NavLink to="/admin/user">Administrar usuarios</NavLink>
      <NavLink to="/" className="sign-out mt-auto">
        Cerrar sesion
      </NavLink>
      <img
        className="mx-auto aspect-square h-20 mt-6"
        src="https://unahur.edu.ar/wp-content/uploads/2021/03/UNAHUR-1.png"
        alt=""
      />
    </nav>
  );
}

export default Navbar;