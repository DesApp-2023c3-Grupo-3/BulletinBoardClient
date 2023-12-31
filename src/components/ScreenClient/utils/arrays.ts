import { Message } from "../mocks/imagenes";
import { DataAdvertising } from "../store/useAdvertisingMessages";

const ADVERTISING_TYPE_VIDEO = 2;

export const filterMessages = (messages: Message[], action: string) => {
  const advertisingMessages = messages.filter(
    (message) => message.action === action,
  );

  return advertisingMessages.map((message) => message.data);
};

export function isArrayWithVideos(array: DataAdvertising[]) {
  return array.some(
    (element) => element.advertisingTypeId === ADVERTISING_TYPE_VIDEO,
  );
}

export function splitList(array: DataAdvertising[]) {
  if (isArrayWithVideos(array)) return splitListWithVideos(array);
  else return splitListWithoutVideos(array);
}

export function splitListWithoutVideos(array: DataAdvertising[]) {
  const newList = array.filter((element) => element.advertisingTypeId !== 2);

  const half = Math.ceil(newList.length / 2);
  const firstHalf = newList.splice(0, half);
  const secondHalf = newList.splice(0, newList.length);

  return [firstHalf, secondHalf];
}

function splitListWithVideos(array: DataAdvertising[]) {
  const arrayWithVideos = array.filter(
    (element) => element.advertisingTypeId === ADVERTISING_TYPE_VIDEO,
  );
  const arrayWithoutVideos = array.filter(
    (element) => element.advertisingTypeId !== ADVERTISING_TYPE_VIDEO,
  );

  return [arrayWithVideos, arrayWithoutVideos];
}

export function theyAreEqual(array1:any[], array2:any[]) {

  if (array1.length !== array2.length) return false

  return array1.every(element => array2.includes(element))

}