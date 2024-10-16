import Loader from '../../../../components/Loader';
import Modal from '../../../../components/Modal/Modal';
import TablaNextUi from '../../../../components/Table/TablaNextUI';
import { Advertising } from '../../../../types/customTypes';
import FormAdvertising from '../Form/FormAdvertising';

interface DesktopBodyProps {
  tableColumns: Map<string, (data: any) => void>;
  handleRowClick: (data: any) => void;
  isOpen: boolean;
  onCloseClick: () => void;
  openModal: () => void;
  GetData: () => void;
  isEditing: boolean;
  editRow?: Advertising;
  loading: boolean;
  datasJSON: Advertising[];
  setAdvertisingJSON: React.Dispatch<React.SetStateAction<Advertising[]>>;
}

export function DesktopBody({
  tableColumns,
  handleRowClick,
  isOpen,
  onCloseClick,
  openModal,
  GetData,
  isEditing,
  editRow,
  loading,
  datasJSON,
  setAdvertisingJSON,
}: DesktopBodyProps) {
  return (
    <>
      <section className="mx-[3%] w-full flex flex-col pb-12">
        <h1 className="text-[4rem] font-[700] text-[#484848] tracking-[-1.28px] mt-[20px] dark:text-[white]">
          Avisos
        </h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="lex flex-col h-full">
            <TablaNextUi
              datasJSON={datasJSON}
              type={1}
              columns={tableColumns}
              onRowClick={handleRowClick}
              placeholder="Buscar Aviso"
              setDatasJSON={setAdvertisingJSON}
            ></TablaNextUi>
            <div className="flex justify-end">
              <Modal
                isOpen={isOpen}
                closeModal={onCloseClick}
                openModal={openModal}
                label="NUEVO AVISO"
              >
                <FormAdvertising
                  setAdvertisingsJSON={GetData}
                  closeModal={onCloseClick}
                  isCreate={!isEditing}
                  advertising={editRow}
                />
              </Modal>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
