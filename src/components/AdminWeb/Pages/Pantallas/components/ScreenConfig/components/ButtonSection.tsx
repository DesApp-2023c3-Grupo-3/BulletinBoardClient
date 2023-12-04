import Swal from 'sweetalert2';
import { screenAPI } from '../../../../../../../services/screens';
import Button from '../../Button/Button';
import ButtonDisabled from '../../Button/ButtonDisabled';
import { useScreenFilters } from '../../../store/useScreenFilters';
import { ConfigProps } from '../../../hooks/useConfig';
import { Card } from '../../../hooks/useCards';

const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const messageError = (error: string) =>
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: error,
    confirmButtonColor: '#2C9CBF',
  });

interface ButtonProps {
  config: ConfigProps;
  cardSelected: Card | undefined;
  closeModal: () => void;
  isAnyCardSelected: boolean;
}

export default function ButtonSection({
  config,
  cardSelected,
  closeModal,
  isAnyCardSelected,
}: ButtonProps) {
  const screens = useScreenFilters((state) => state.screens);
  const selectedScreens = screens.filter((screen) => screen.isSelected);
  const deselectAllTheScreens = useScreenFilters(
    (state) => state.deselectAllTheScreens,
  );

  const updateScreens = () => {
    selectedScreens.forEach((screen) => {
      screen.typeScreen = String(cardSelected?.id);
    });

    const mappedScreens = selectedScreens.map((screen) => {
      const { id, typeScreen, subscription, sector } = screen;

      return {
        id,
        templeteId: typeScreen,
        subscription,
        courseIntervalTime: config.courseIntervalTime,
        advertisingIntervalTime: config.advertisingIntervalTime,
        sector,
      };
    });

    return screenAPI.edit(mappedScreens);
  };

  const handleSuccessfulMessage = (message: string, promise: Promise<any>) => {
    promise
      .then(() => {
        Toast.fire({
          icon: 'success',
          title: message,
        });
      })
      .then(() => {
        deselectAllTheScreens();
        closeModal();
      })
      .catch((error) => messageError(error.message));
  };

  const handleUpdateClick = () => {
    handleSuccessfulMessage('Se aplico correctamente', updateScreens());
  };

  const handleSignOffClick = (id: number) => {
    handleSuccessfulMessage(
      'Cierre de sesión aplicado correctamente',
      screenAPI.disconnect(id),
    );
  };

  return (
    <div className="flex text-xl md:text-2xl gap-5 font-[500] text-white">
      {cardSelected || selectedScreens.length > 1 ? (
        <ButtonDisabled
          action={handleUpdateClick}
          label="APLICAR"
          condition={isAnyCardSelected}
          styleActive="rounded-lg flex items-center justify-center w-[300px] h-[40px] bg-[#2C9CBF] hover:bg-[#2c9dbfc5]"
          styleDesactive="rounded-lg flex items-center justify-center text-2xl w-[300px] border-solid border-2 bg-[#ffffff] h-[40px] text-blue-300 border-blue-200"
        />
      ) : (
        <Button
          onClick={() => handleSignOffClick(selectedScreens[0].id)}
          label="CERRAR SESIÓN"
          className="rounded-lg flex items-center justify-center w-[300px] h-[40px] bg-red-500 hover:bg-red-600"
        />
      )}
    </div>
  );
}
