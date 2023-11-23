import { useEffect, useState } from 'react';
import { Commission } from '../../types/customTypes';
import { commissionApi } from '../../../../services/commissions';
import { Helmet } from 'react-helmet';
import Modal from '../../components/Modal/Modal';
import { useModal } from '../../hooks/useModal';
import FormCommission from './components/Form/FormCommission';
import Table from '../../components/Table/Table';
import dayjs from 'dayjs';
import Loader from '../../components/Loader';
import React from 'react';
import { MobileBody } from '../../components/Mobile/MobileBody';
import { FormMobile } from './components/Mobile/FormMobile';

function Comisiones() {
  const [commissionsJSON, setCommissionsJSON] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const updateCommissionsTable = async () => {
    setLoading(true);
    try {
      const updatedCommissions: any = await commissionApi.getAll();
      setCommissionsJSON((updatedCommissions?.data as Commission[]) || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateCommissionsTable();
  }, []);

  const { isOpen, openModal, closeModal } = useModal();

  const tableColumns = new Map<string, (advertising: any) => void>([
    [
      'Materia',
      (commission: Commission) => {
        return commission.subject.name;
      },
    ],
    [
      'Comisión',
      (commission: Commission) => {
        return commission.name;
      },
    ],
    [
      'Aula',
      (commission: Commission) => {
        return commission.classroom.name;
      },
    ],
    [
      'Horario',
      (commission: Commission) =>
        `${dayjs(commission.schedule.startHour).format('hh:mm')} - ${dayjs(
          commission.schedule.endHour,
        ).format('hh:mm')}`,
    ],
  ]);

  const tableColumnsMobile = new Map<string, (advertising: any) => void>([
    [
      'Materia',
      (commission: Commission) => {
        return commission.subject.name;
      },
    ],
    [
      'Comisión',
      (commission: Commission) => {
        return commission.name;
      },
    ],
    [
      'Aula',
      (commission: Commission) => {
        return commission.classroom.name;
      },
    ],
  ]);

  const [isMobile, setIsMobile] = React.useState(
    window.matchMedia('(max-width: 768px)').matches,
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Administrador de cartelera | Comisiones</title>
      </Helmet>
      <div className={`w-full h-full ${!isMobile && 'mx-[3%]'}`}>
        {isMobile ? (
          <MobileBody
            dataJson={commissionsJSON}
            tableColumns={tableColumnsMobile}
            isOpen={isOpen}
            onCloseClick={closeModal}
            openModal={openModal}
            loading={loading}
            title="Comisiones"
            placeholder="Buscar Comision"
          >
            <FormMobile
              setCommissionsJSON={setCommissionsJSON}
              closeModal={closeModal}
            />
          </MobileBody>
        ) : (
          <div>
            <h1 className="text-[4rem] font-[700] text-[#484848] tracking-[-1.28px] mt-[20px]">
              Comisiones
            </h1>
            {loading ? (
              <Loader />
            ) : (
              <div className="mt-[-70px]">
                <Table
                  dataJSON={commissionsJSON}
                  columns={tableColumns}
                  placeholder="Buscar Comision"
                />
                <div className="flex justify-end">
                  <Modal
                    isOpen={isOpen}
                    closeModal={closeModal}
                    openModal={openModal}
                    label="AGREGAR COMISIONES"
                  >
                    <FormCommission
                      commissionsJSON={commissionsJSON}
                      setCommissionsJSON={setCommissionsJSON}
                      closeModal={closeModal}
                    />
                  </Modal>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Comisiones;
