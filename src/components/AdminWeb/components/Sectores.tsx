import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { abbreviateSectorName } from '../utils/AbbreviateSectorName';
import { Checkbox } from '@mui/material';
import { sectorApi } from '../../../services/sectores';
import Loader from './Loader';

interface SectoresProps {
  selectedSector: any[];
  onSelectedSectorChange: (newSelectedSector: any[]) => void;
  style?: string;
  hasError: boolean;
  canChooseMany: boolean;
}

function Sectores({
  selectedSector,
  onSelectedSectorChange,
  style,
  hasError,
  canChooseMany,
}: SectoresProps) {
  const [selectAll, setSelectAll] = useState(false);
  const [sectorArray, setSectorArray] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);

  const updateSectorArray = async () => {
    setLoading(true);
    try {
      const newSectors = await sectorApi.getSector();
      setSectorArray(sortedSectors(newSectors));
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectAllChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setSelectAll(event.target.checked);

    if (!selectAll) {
      onSelectedSectorChange(sectorArray);
    } else {
      onSelectedSectorChange([]);
    }
  };

  const handlerOnSelect = (selected: Sector[]) => {
    const toChange = Array.isArray(selected) ? selected : [selected];
    onSelectedSectorChange(toChange);
  };

  const isSelected = (sector: any) => {
    const index = selectedSector.findIndex((s) => s.id === sector.id);
    if (index !== -1) {
      selectedSector[index] = sector;
    }
    return selectedSector.find((s) => s.id === sector.id);
  };

  useEffect(() => {
    updateSectorArray();
  }, []);

  useEffect(() => {
    if (selectedSector.length === sectorArray.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [handlerOnSelect]);

  const isMobile = window.innerWidth <= 640;

  return (
    <div className={`z-[1000] flex justify-center ${style}`}>
      <Listbox
        value={selectedSector}
        onChange={handlerOnSelect}
        multiple={canChooseMany}
      >
        <div className=" flex-row justify-center relative z-[20]">
          <Listbox.Button
            id="sectors"
            className={`text-[20px] font-[400] tracking-[-0.4px] rounded-[30px] bg-[#D9D9D9] flex w-[365px] max-h-[365px]: h-[50px] px-[40px] py-[12px] items-center ${
              selectedSector.length === 0 && hasError ? 'invalid-field' : ''
            }
            ${isMobile ? 'w-[90vw]' : ''}
            `}
          >
            <div className="mr-5 ml-[-15px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="29"
                viewBox="0 0 24 29"
                fill="none"
              >
                <path
                  d="M12 27.5C12.2747 27.5 12.5075 27.4103 12.6532 27.3429C12.8143 27.2683 12.9701 27.1724 13.113 27.0738C13.3992 26.8762 13.7145 26.6109 14.0367 26.3149C14.6853 25.719 15.4462 24.9206 16.1975 24.0818C17.6923 22.4129 19.2376 20.4848 19.8746 19.5112C19.9294 19.4275 19.9837 19.3446 20.0375 19.2625C21.771 16.6166 23 14.7407 23 11.4195C23 5.60949 18.018 1 12 1C5.98205 1 1 5.60949 1 11.4195C1 14.8474 2.20738 16.7121 4.0359 19.5107C4.71599 20.5515 6.28652 22.4822 7.79415 24.1358C8.5522 24.9672 9.31716 25.7538 9.96849 26.3397C10.292 26.6308 10.6082 26.8911 10.895 27.0848C11.0381 27.1814 11.1938 27.2751 11.3544 27.3478C11.5 27.4137 11.73 27.5 12 27.5Z"
                  fill="#919191"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 16.1295C14.7614 16.1295 17 14.0209 17 11.4197C17 8.8186 14.7614 6.70996 12 6.70996C9.23858 6.70996 7 8.8186 7 11.4197C7 14.0209 9.23858 16.1295 12 16.1295Z"
                  fill="#D9D9D9"
                />
              </svg>
            </div>
            <span className="absolute flex ml-3 text-black opacity-[0.33] truncate w-[80%]">
              {selectedSector.length === 0
                ? 'Sector/es'
                : `${selectedSector
                    .map((sector) => sector.topic.toLocaleUpperCase())
                    .join(', ')}`}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className=" bg-white w-[254px] ml-auto shadow-lg rounded-t-[2px] rounded-b-[10px] pb-3 absolute left-[15%]">
              <span className="m-3 flex justify-center text-[#00000080] text-[20px]">
                Edificio
              </span>
              {loading ? (
                <Loader />
              ) : (
                sectorArray.length > 0 &&
                sectorArray.map((sector) => (
                  <div key={sector.id} className="flex justify-center">
                    <div>
                      <Listbox.Option
                        className={({ active }) =>
                          ` border-2 border-[#919191] flex justify-start items-center relative cursor-pointer mb-[3px] pl-2 rounded-[20px] h-[30px] w-[82px] 
                                ${
                                  active
                                    ? 'bg-[#3cacce] text-white'
                                    : 'text-[#000]'
                                }
                                ${
                                  isSelected(sector)
                                    ? 'bg-[#2C9CBF] border-[#2C9CBF]'
                                    : ''
                                }
                                `
                        }
                        value={sector}
                      >
                        {() => (
                          <div className="flex justify-start items-center truncate">
                            <span
                              className={`truncate flex justify-start items-center${
                                isSelected(sector)
                                  ? 'font-medium text-white '
                                  : 'font-normal'
                              }`}
                            >
                              {sector.topic.toLocaleUpperCase()}
                            </span>
                          </div>
                        )}
                      </Listbox.Option>
                    </div>
                  </div>
                ))
              )}
              {canChooseMany && (
                <div className="flex justify-center items-center">
                  <Checkbox
                    checked={selectAll}
                    onChange={
                      sectorArray.length > 0 ? handleSelectAllChange : () => {}
                    }
                  />
                  <span>Seleccionar todo</span>
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default Sectores;

const sortedSectors = (sectors: Sector[]): Sector[] => {
  return [...sectors].sort((a, b) => a.id - b.id);
};

export interface Sector {
  id: number;
  name: string;
  topic?: any;
}
