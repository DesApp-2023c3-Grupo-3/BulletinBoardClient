import { Button, Image, Input } from '@nextui-org/react';
import Modal from '../../../../../components/Modal/Modal';
import { ModalMapProps } from '../../../types/ModalMap';
import { useMaps } from '../../../store/useMaps';
import { useEffect, useState } from 'react';
import { mapApi } from '../../../../../../../services/map';
import Loader from '../../../../../components/Loader';
import DownloadMapButton from './Buttons/DownloadMap';
import DeleteMapButton from './Buttons/DeleteMap';
import SelectMapButton from './Buttons/SelectMap';
import EditMapButton from './Buttons/EditMapButton';
import SaveMapButton from './Buttons/SaveMapButton';
import { useFormMap } from '../../../store/useFormMap';

function ModalMapView({ isOpen, closeModal, openModal }: ModalMapProps) {
  const { selectedMap } = useMaps();

  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState<File>();

  const [isEditing, setIsEditing] = useState(false);

  const { name, setName, file, setFile } = useFormMap();

  useEffect(() => {
    if (!isOpen) setIsEditing(false);
  }, [isOpen]);

  useEffect(() => {
    if (selectedMap) {
      setIsLoading(true);
      mapApi.getImageById(selectedMap?.id).then((res) => {
        const blob = new Blob([res.data], { type: 'image/png' });
        const newImage = new File([blob], selectedMap.originalName, {
          type: 'image/png',
        });
        setFile(newImage);
        setImage(newImage);
        setIsLoading(false);
        setName(selectedMap.name);
      });
    }
  }, [selectedMap]);

  const isValidChange =
    name !== selectedMap?.name || file?.name !== image?.name;

  const onCloseModal = () => {
    setFile(undefined);
    setName('');
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onCloseModal}
      openModal={openModal}
      label=""
    >
      <div className="flex p-3 flex-col items-center gap-2">
        <div>
          <div className={`flex flex-col gap-1 text-center`}>
            {isEditing ? (
              <Input
                size="lg"
                placeholder="Escribe un nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <h3 className="text-3xl font-bold">{selectedMap?.name}</h3>
            )}
            <h5>{selectedMap?.originalName}</h5>
          </div>
        </div>

        <div className="rounded-[20px] flex justify-center items-center bg-[#D9D9D9] w-[700px] h-[328px] relative">
          {!isLoading ? (
            isEditing ? (
              <>
                <div className="cursor-pointer">
                  {image && (
                    <Image
                      src={URL.createObjectURL(image)}
                      className="max-h-[328px] max-w-[700px]"
                    />
                  )}
                </div>
                <label className="text-slate-200 cursor-pointer text-4xl font-bold flex items-center justify-center h-full w-full opacity-0 rounded-[20px] transition-all bg-black/80 absolute z-50 hover:opacity-100">
                  Click para elegir un mapa
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden h-full w-full"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setImage(files[0]);
                      }
                    }}
                  />
                </label>
              </>
            ) : (
              file && (
                <Image
                  src={URL.createObjectURL(file)}
                  className="max-h-[328px] max-w-[700px]"
                />
              )
            )
          ) : (
            <Loader />
          )}
        </div>
        <div className="flex gap-3 w-full px-10 justify-center">
          {isEditing ? (
            <>
              <SaveMapButton
                newMap={image}
                onClick={closeModal}
                isDisabled={isLoading || !isValidChange}
              />
              <Button
                color="primary"
                className="h-[3rem] font-semibold text-xl"
                radius="full"
                onClick={() => setIsEditing(false)}
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
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </Button>
            </>
          ) : (
            <>
              <SelectMapButton isLoading={isLoading} closeModal={closeModal} />
              <EditMapButton
                isLoading={isLoading}
                onClick={() => setIsEditing(!isEditing)}
              />
              <DownloadMapButton isLoading={isLoading} />
              <DeleteMapButton isLoading={isLoading} closeModal={closeModal} />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalMapView;
