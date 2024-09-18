import Loader from '../../../../components/Loader';
import Modal from '../../../../components/Modal/Modal';
import Table from '../../../../components/Table/Table';
import { Advertising } from '../../../../types/customTypes';
import FormAdvertising from '../Form/FormAdvertising';

interface DesktopBodyProps {
  advertisingsJSON: any[];
  tableColumns: Map<string, (data: any) => void>;
  handleRowClick: (data: any) => void;
  isOpen: boolean;
  onCloseClick: () => void;
  openModal: () => void;
  GetData: () => void;
  isEditing: boolean;
  editRow?: Advertising;
  loading: boolean;
  currentPages?: number;
  totalItems?: number;
  setCurrentPage?: any;
}

export function DesktopBody({
  advertisingsJSON,
  tableColumns,
  handleRowClick,
  isOpen,
  onCloseClick,
  openModal,
  GetData,
  isEditing,
  editRow,
  loading,
  currentPages,
  totalItems,
  setCurrentPage,
}: DesktopBodyProps) {
  return (
    <>
      <section className="mx-[3%] w-full flex flex-col pb-12">
        <h1 className="text-[4rem] font-[700] text-[#484848] tracking-[-1.28px] mt-[20px]">
          Avisos
        </h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="mt-[-70px] flex flex-col h-full">
            <Table
              dataJSON={advertisingsJSON}
              columns={tableColumns}
              onRowClick={handleRowClick}
              placeholder="Buscar Aviso"
              currentPage={currentPages}
              totalItems={totalItems}
              setCurrentPage={setCurrentPage}
            />
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
