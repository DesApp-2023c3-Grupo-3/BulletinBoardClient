import { Helmet } from 'react-helmet';
import { FormEvent, useEffect, useState } from 'react';
import Button from '../../components/Buttons/Button';
import { userApi } from '../../../../services/users';
import { useModal } from '../../hooks/useModal';
import Roles from '../../components/Roles';
import dayjs from 'dayjs';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader';
import Swal from 'sweetalert2';
import { MobileBody } from '../../components/Mobile/MobileBody';
import { FormMobile } from './components/Form/FormMobile';
import { userDiv } from '../../utils/userDiv';
import { useIsMobile } from '../../hooks/useIsMobile';
import ListOfUsersCards from '../../components/Mobile/ListOfUsersCards';
import useSearchTerm from '../../hooks/useSearchTermAdvertising';
import { Input } from '@nextui-org/react';
import EyeIcon from './components/Icons/EyeIcon';
import TablaNextUI from '../../components/Table/TablaNextUI';
import { useTabla } from '../../hooks/useTable';

const initialStateFields = {
  username: '',
  password: '',
  dni: '',
  role: {
    id: -1,
    name: 'Rol del usuario',
  },
};

function Usuarios() {
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();

  const [error, setError] = useState(false);

  const onCloseModal = () => {
    closeModal();
    setError(false);
    setFields({
      username: '',
      password: '',
      dni: '',
      role: {
        id: -1,
        name: 'Rol del usuario',
      },
    });
  };

  const [editRow, setEditRow] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setSearchTerm } = useSearchTerm();

  const [fields, setFields] = useState(initialStateFields);

  const handleRowClick = (user: User) => {
    const { name, password, role, dni } = user;

    setFields({
      username: name,
      password: password,
      dni: dni,
      role: role || fields.role,
    });

    setEditRow(user);
    setIsEditing(true);
    openModal();
  };

  const tableColumns = new Map<string, (user: any) => void>();
  tableColumns.set('DNI', (user: User) => user.dni);
  tableColumns.set('Nombre', (user: User) => user.name);
  tableColumns.set('Rol', (user: User) => user.role?.name);
  tableColumns.set('Creación', (user: User) => createdUserDate(user));

  const handleSelectedUserRoleChange = (newSelectedRole: any) => {
    setFields({
      ...fields,
      role: newSelectedRole,
    });
  };

  const hasValidUser = () => {
    return (
      !invalidUsername &&
      !invalidPassword &&
      !invalidDNI &&
      fields.role.id !== -1
    );
  };

  const invalidUsername = fields.username.trim() === '';
  const invalidPassword = fields.password.trim() === '';
  const invalidDNI = fields.dni.trim() === '';

  const createdUserDate = (user: User) =>
    dayjs(user.createdAt).format('D/MM/YY - hh:mm');

  const createNewUser = (e: FormEvent) => {
    e.preventDefault();

    setError(!hasValidUser());

    if (!hasValidUser()) return;

    setLoadingCreate(true);

    if (isEditing) {
      userApi
        .update({
          id: editRow?.id,
          name: fields.username,
          dni: fields.dni,
          password: fields.password,
          role: fields.role,
        })
        .then(() => {
          updateUsersTable();
          closeModal();
          setFields(initialStateFields);
          setLoadingCreate(false);
        });
    } else {
      userApi
        .create({
          name: fields.username,
          dni: fields.dni,
          password: fields.password,
          role: fields.role,
        })
        .then(() => {
          updateUsersTable();
          closeModal();
          setFields(initialStateFields);
          setLoadingCreate(false);
        });
    }
  };

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditRow({
      name: '',
      dni: '',
      password: '',
      role: {
        id: -1,
        name: 'Rol del usuario',
      },
    });
    openModal();
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  const handleDeleteUserClick = (e: any) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No se podrá recuperar el usuario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar.',
    }).then((result) => {
      setLoading(true);
      if (result.isConfirmed && editRow) {
        userApi
          .delete(editRow)
          .then(() => {
            Toast.fire({
              icon: 'success',
              title: 'Se ha eliminado el usuario',
            });
            closeModal();
            setLoading(false);
            setIsEditing(false);
          })
          .then(() => updateUsersTable())
          .catch((error) => console.error(error));
      }
      if (result.isDenied || result.isDismissed) {
        setLoading(false);
      }
    });
  };

  const { usersJSON, setUsersJSON, setPages, setTotalItems, currentPagesU } =
    useTabla();

  const updateUsersTable = async () => {
    setLoading(true);
    userApi
      .getPaginated(currentPagesU, Math.floor(window.innerHeight / 70), '')
      .then((r) => {
        setUsersJSON(r.data.data);
        setTotalItems(r.data.total);
        setPages(r.data.totalPages);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    updateUsersTable();

    return () => {
      setSearchTerm('');
    };
  }, []);

  const isMobile = useIsMobile();

  const tableColumnsMobile = new Map<string, (user: any) => void>();
  tableColumnsMobile.set('DNI', (user: User) => user.dni);
  tableColumnsMobile.set('Nombre', (user: User) => user.name);
  tableColumnsMobile.set('Rol', (user: User) =>
    user.role ? userDiv(user.role.name.charAt(0)) : '',
  );

  return (
    <>
      <Helmet>
        <title>Administrador de cartelera | Usuarios</title>
      </Helmet>
      {!isMobile ? (
        <div className="flex flex-col w-full pl-12">
          <h1 className="text-[4rem] font-[700] text-[#484848] tracking-[-1.28px] mt-[20px] dark:text-[white]">
            Usuarios
          </h1>
          {loading ? (
            <Loader />
          ) : (
            <div className=" mr-[3.1%]">
              <TablaNextUI
                datasJSON={usersJSON}
                columns={tableColumns}
                type={3}
                onRowClick={handleRowClick}
                placeholder="Buscar usuarios..."
                setDatasJSON={setUsersJSON}
              />
              <div className="flex justify-end">
                <Modal
                  isOpen={isOpen}
                  openModal={handleOpenModal}
                  closeModal={onCloseModal}
                  label={'NUEVO USUARIO'}
                >
                  <div className="p-5">
                    <form className="flex justify-evenly items-center">
                      <div className="flex flex-col gap-4 w-2/4">
                        <Input
                          type="number"
                          label="DNI"
                          placeholder="Ingrese el DNI"
                          value={fields.dni}
                          radius="full"
                          onChange={(e) => {
                            setFields({
                              ...fields,
                              dni: e.target.value,
                            });
                          }}
                          classNames={{
                            errorMessage: 'dark:text-red-300',
                          }}
                          isInvalid={!fields.dni && error}
                          errorMessage="Ingrese un DNI"
                        />
                        <Roles
                          selectedRole={fields.role}
                          onSelectedRoleChange={handleSelectedUserRoleChange}
                          hasError={fields.role.id === -1 && error}
                        />
                        <Input
                          label="Password"
                          placeholder="Ingrese la contraseña"
                          radius="full"
                          fullWidth
                          classNames={{
                            errorMessage: 'dark:text-red-300',
                          }}
                          endContent={
                            <EyeIcon
                              isVisible={isPasswordVisible}
                              onClick={() =>
                                setIsPasswordVisible(!isPasswordVisible)
                              }
                            />
                          }
                          errorMessage="Ingrese una contraseña"
                          isInvalid={!fields.password && error}
                          onChange={(e) => {
                            setFields({
                              ...fields,
                              password: e.target.value,
                            });
                          }}
                          type={isPasswordVisible ? 'text' : 'password'}
                        />
                        <Input
                          type="text"
                          label="Nombre"
                          placeholder="Ingrese su nombre"
                          classNames={{
                            errorMessage: 'dark:text-red-300',
                          }}
                          onChange={(e) => {
                            setFields({
                              ...fields,
                              username: e.target.value,
                            });
                          }}
                          errorMessage="Ingrese un nombre de usuario"
                          radius="full"
                          isInvalid={!fields.username && error}
                          value={fields.username}
                        />
                      </div>
                      <div className="flex flex-col justify-center items-center gap-4 w-2/4">
                        <article className="text-center">
                          <img
                            src="https://cdn.discordapp.com/attachments/1143714208404471908/1165447224805826601/Usuario.png?ex=6546e24f&is=65346d4f&hm=9d49d67482396f4d8b724cfc900d52b7a47382794abf63292d137ebafb7b0bc2&"
                            alt="User preview"
                            className="hidden"
                          />
                          <div className="bg-[#2C9CBF] aspect-square h-32 rounded-full relative mx-auto">
                            <span className="text-white text-5xl text-center w-fit h-fit m-auto absolute inset-0 itim">
                              {fields.role.name[0]}
                            </span>
                          </div>
                          <h4 className="text-xl dark:text-white font-bold mt-2">
                            {fields.username || 'Nombre del usuario'}
                          </h4>
                          <span className="dark:text-white">
                            {fields.role.name}
                          </span>
                        </article>
                        {loadingCreate ? (
                          <Loader />
                        ) : (
                          <Button
                            label={'GUARDAR'}
                            onClick={createNewUser}
                            active={hasValidUser()}
                            type={1}
                          />
                        )}
                        {!isEditing ? null : loadingCreate ? (
                          <Loader />
                        ) : (
                          <Button
                            onClick={handleDeleteUserClick}
                            active={true}
                            type={3}
                            label="ELIMINAR"
                          />
                        )}
                      </div>
                    </form>
                  </div>
                </Modal>
              </div>
            </div>
          )}
        </div>
      ) : (
        <MobileBody
          ListOfData={
            <ListOfUsersCards
              dataJson={usersJSON}
              handleCardClick={handleRowClick}
            />
          }
          isOpen={isOpen}
          onCloseClick={closeModal}
          openModal={handleOpenModal}
          loading={loading}
          title="Usuarios"
        >
          <FormMobile
            setUserJSON={updateUsersTable}
            user={editRow}
            isEditing={isEditing}
            closeModal={closeModal}
          />
        </MobileBody>
      )}
    </>
  );
}

export default Usuarios;
