import DatePickerDays from '../../../../components/DatePickerDays';
import Sectores from '../../../../components/Sectores';
import ImageTextVideo from './ImageTextVideo/ImageTextVideo';
import DayPicker, { Days } from './DayPicker';
import PickerTime from './PickerTime';
import Swal from 'sweetalert2';
import './form.sass';
import dayjs, { Dayjs } from 'dayjs';
import { Advertising } from '../../../../types/customTypes';
import ErrorMessage from '../../../../components/ErrorMessage';
import Button from '../../../../components/Buttons/Button';
import * as React from 'react';
import { asAdvertisings } from '../../../../../../services/advertisings';

function messageError(message: string) {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    confirmButtonColor: '#2C9CBF',
  });
}

function validationDate(start: Date | null, end: Date | null) {
  return (
    dayjs(start).format() === 'Invalid Date' ||
    dayjs(end).format() === 'Invalid Date'
  );
}

interface FormAdvertisingProps {
  advertisingsJSON: Advertising[];
  setAdvertisingsJSON: React.Dispatch<React.SetStateAction<Advertising[]>>;
  closeModal: () => void;
  isCreate: Boolean;
  advertising?: Advertising;
}

function FormAdvertising({
  advertisingsJSON, //LISTA DE AVISOS
  setAdvertisingsJSON, //AGREGAR UN AVISO
  closeModal,
  isCreate,
  advertising,
}: FormAdvertisingProps) {
  //Nombre del aviso
  const [advertisingName, setAdvertisingName] = React.useState(
    advertising ? advertising.name : '',
  );

  //Hora del aviso
  const [startHour, setStartHour] = React.useState<Date | null>(
    advertising
      ? new Date(advertising?.advertisingSchedules[0].schedule.startHour)
      : null,
  );
  const [endHour, setEndHour] = React.useState<Date | null>(
    advertising
      ? new Date(advertising?.advertisingSchedules[0].schedule.endHour)
      : null,
  );

  const handleStartHourChange = (newStartHour: Date) => {
    setStartHour(newStartHour);
  };

  const handleEndHourChange = (newEndHour: Date) => {
    setEndHour(newEndHour);
  };

  //fechas del aviso
  const [startDate, setStartDate] = React.useState<Date | null>(
    advertising
      ? new Date(advertising?.advertisingSchedules[0].schedule.startDate)
      : null,
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    advertising
      ? new Date(advertising?.advertisingSchedules[0].schedule.endDate)
      : null,
  );

  const handleStartDateChange = (newStartDate: Date) => {
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (newEndDate: Date) => {
    setEndDate(newEndDate);
  };

  //Día de la semana del aviso
  const [selectedDays, setSelectedDays] = React.useState<Days[]>(
    //advertising ? advertising.advertisingSchedules[0].schedule.dayCode :
    [],
  );

  const handleDaysChange = (newDays: Days[]) => {
    setSelectedDays(newDays);
  };

  //sectores

  interface Sector {
    id: number;
    name: string;
  }

  const [selectedSector, setSelectedSector] = React.useState<Sector[]>([]); //ESTO HAY QUE CAMBIARLO

  const handleSelectedSectorChange = (newSelectedSector: Sector[]) => {
    setSelectedSector(newSelectedSector);
  };

  function eliminarAdvertising(advertisingId: number) {
    const advertisingFilter = advertisingsJSON.filter(
      (advertising) => advertising.id !== advertisingId,
    );
    setAdvertisingsJSON(advertisingFilter);
  }

  const [emptyFields, setEmptyFields] = React.useState({
    advertisingName: false,
    selectedSector: false,
    selectedDays: false,
    date: false,
    hour: false,
  });

  //Alerts
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

  const handleDeleteAdvertisingClick = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No se podrá recuperar el aviso.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar.',
    }).then((result) => {
      if (result.isConfirmed) {
        if (advertising) {
          eliminarAdvertising(advertising.id);
          Toast.fire({
            icon: 'success',
            title: 'Se ha eliminado el aviso',
          });
          closeModal();
        }
      }
    });
  };

  const handleSendAdvertisingClick = () => {
    const emptyFieldsUpdate = {
      advertisingName: advertisingName === '',
      selectedSector: selectedSector.length === 0,
      selectedDays: selectedDays.length === 0,
      date: validationDate(startDate, endDate),
      hour: validationDate(startHour, endHour),
    };
    setEmptyFields(emptyFieldsUpdate);

    const convertDaysToNumbers = (selectedDays: Days[]): string[] => {
      return selectedDays.map((day) => day.id.toString());
    };

    const daysCode = convertDaysToNumbers(selectedDays);

    const hstart = dayjs(startHour).format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
    const hend = dayjs(endHour).format('YYYY-MM-DD HH:mm:ss.SSS ZZ');

    const DatesHours = {
      startDate: startDate,
      endDate: endDate,
      startHour: hstart,
      endHour: hend,
    };
    const schedules = daysCode.map((dayCode) => ({
      ...DatesHours,
      dayCode,
    }));

    const sectores = selectedSector.map((sectors) => {
      const { name, ...rest } = sectors;
      return rest;
    });

    const newAdvertising = {
      name: advertisingName,
      payload: 'Este deberia llegar a sector 1 y 2',
      advertisingType: {
        id: 1,
      },
      user: {
        id: 1,
      },
      sectors: sectores,
      schedules: schedules,
    };

    //VALIDACIONES

    if (Object.values(emptyFieldsUpdate).filter((value) => value).length > 1) {
      //Faltaría agregar una lista de los campos que estan incompletos y ponerlo en el mensaje de error.
      messageError('Hay campos incompletos.');
    } else if (!advertisingName) {
      messageError('Falta completar el nombre del aviso.');
    } else if (selectedSector.length === 0) {
      messageError('Falta completar los sectores.');
    } else if (validationDate(startDate, endDate)) {
      messageError('Falta completar las fechas del aviso.');
    } else if (selectedDays.length === 0) {
      messageError('Falta seleccionar los días de la semana.');
    } else if (validationDate(startHour, endHour)) {
      messageError('Falta completar el horario de los avisos.');
    } else if (endDate !== null && startDate !== null && endDate <= startDate) {
      messageError('La fecha final no debe ser anterior a la de inicio.');
    } else {
      asAdvertisings.create(newAdvertising);
      closeModal();

      Toast.fire({
        icon: 'success',
        title: 'Se ha creado el aviso',
      });
    }
  };

  return (
    <div>
      <form className="mx-10">
        <div className=" flex h-[90px] justify-between items-center">
          <div className="flex-col justify-center relative">
            <input
              id="advertisingName"
              type="text"
              placeholder="Nombre del aviso..."
              className={`text-[20px] font-[400] tracking-[-0.4px] rounded-[30px] bg-[#D9D9D9] flex w-[365px] h-[50px] px-[40px] py-[12px] items-center ${
                emptyFields.advertisingName ? 'invalid-field' : ''
              }`}
              value={advertisingName}
              onChange={(e) => setAdvertisingName(e.target.value)}
              defaultValue={advertisingName}
              autoComplete="off"
            ></input>
            {ErrorMessage(
              '*Falta completar el nombre del aviso.',
              emptyFields.advertisingName,
            )}
          </div>
          <div className="flex-col justify-center">
            <Sectores
              selectedSector={selectedSector}
              onSelectedSectorChange={handleSelectedSectorChange}
              campos={emptyFields}
            />
            <div>
              {ErrorMessage(
                '*Falta seleccionar los sectores.',
                emptyFields.selectedSector,
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between h-[348px]">
          <div className="flex-col justify-center items-center m-5 ">
            <div className="flex-col justify-center">
              <DatePickerDays
                onChangeStartDate={handleStartDateChange}
                onChangeEndDate={handleEndDateChange}
                init={advertising?.advertisingSchedules[0].schedule.startDate}
                final={advertising?.advertisingSchedules[0].schedule.endDate}
              />
              {ErrorMessage('*Falta completar las fechas.', emptyFields.date)}
            </div>
            <div className="flex-col justify-center pt-10">
              <DayPicker
                onSelectedDaysChange={handleDaysChange}
                selectedDays={selectedDays}
              />
              {ErrorMessage(
                '*Falta elegir los días.',
                emptyFields.selectedDays,
              )}
            </div>
            <div className="flex-col justify-center pt-10">
              <PickerTime
                onChangeStartHour={handleStartHourChange}
                onChangeEndHour={handleEndHourChange}
                init={advertising?.advertisingSchedules[0].schedule.startHour}
                final={advertising?.advertisingSchedules[0].schedule.endHour}
              />
              {ErrorMessage('*Falta completar los horarios', emptyFields.hour)}
            </div>
          </div>
          <div className="pr-[1em] pt-[20px] z-[999]">
            <ImageTextVideo />
          </div>
        </div>
      </form>
      <div className="flex justify-between mt-[2em] mx-[4.5em]">
        <div>
          <Button
            onClick={handleDeleteAdvertisingClick}
            active={true}
            type={0}
            label="ELIMINAR"
            className={`${
              isCreate
                ? 'hidden'
                : 'bg-[white] border-2 border-red-500 rounded-[30px] py-[16px] w-[300px] h-[40px] font-[600] text-[20px] flex items-center justify-center hover:bg-[red] hover:text-[white] text-[red]'
            }`}
          />
        </div>
        <div className="">
          <Button
            onClick={isCreate ? handleSendAdvertisingClick : closeModal}
            active={true}
            type={1}
            label="GUARDAR"
            className="rounded-[30px] py-[16px] w-[300px] h-[40px] font-[600] text-[20px] flex items-center justify-center hover:bg-[#2c9dbfc5]"
          />
        </div>
      </div>
    </div>
  );
}

export default FormAdvertising;
