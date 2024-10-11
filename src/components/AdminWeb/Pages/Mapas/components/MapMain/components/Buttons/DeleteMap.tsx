import { Button, Tooltip } from '@nextui-org/react';
import { useMaps } from '../../../../store/useMaps';
import { mapApi } from '../../../../../../../../services/map';
import { Toast } from '../../../../../Avisos/components/Form/FormAdvertising';

function DeleteMapButton({
  isLoading,
  closeModal,
}: {
  isLoading: boolean;
  closeModal: () => void;
}) {
  const { selectedMap, setMaps, maps } = useMaps();

  const handleDelete = () => {
    if (selectedMap) {
      mapApi.delete(selectedMap.id).then(() => {
        closeModal();
        Toast.fire({
          icon: 'success',
          title: 'Se eliminó correctamente',
        });
        setMaps(maps.filter((map) => map.id !== selectedMap.id));
      });
    }
  };

  return (
    <Tooltip showArrow={true} content="Eliminar" className="font-semibold">
      <Button
        className="h-[3rem] text-white text-xl font-semibold"
        color="danger"
        radius="full"
        isDisabled={isLoading}
        onClick={handleDelete}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </Button>
    </Tooltip>
  );
}

export default DeleteMapButton;
