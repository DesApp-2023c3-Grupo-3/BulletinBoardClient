import { createEndHour } from '../../utils/createEndHour';
import { createSchedule } from '../../utils/createSchedule';
import { createSectors } from '../../utils/createSectors';
import { createStarthour } from '../../utils/createStartHour';
import CardMobileInfo from './CardMobileInfo';
import ListOfCardsLayout from './ListOfCardsLayout';

function ListOfAdvertisingCards({
  dataJson,
  handleCardClick,
}: {
  dataJson: any[];
  handleCardClick: ((data: any) => void) | undefined;
}) {
  return (
    <ListOfCardsLayout>
      {dataJson.map((advertising) => {
        return (
          <CardMobileInfo
            key={advertising.id}
            onClick={() => handleCardClick && handleCardClick(advertising)}
          >
            <div className="flex gap-4 justify-between items-center w-full px-2">
              <CardMobileInfo.Picture text={advertising.user.role.name[0]} />
              <CardMobileInfo.Name>{advertising.name}</CardMobileInfo.Name>
              <CardMobileInfo.State state={advertising.status} />
            </div>
            <CardMobileInfo.Text>{`${createStarthour(
              advertising,
            )} - ${createEndHour(advertising)}`}</CardMobileInfo.Text>
            <CardMobileInfo.Text>
              {createSchedule(advertising)}
            </CardMobileInfo.Text>
            <CardMobileInfo.Text>
              {createSectors(advertising)}
            </CardMobileInfo.Text>
          </CardMobileInfo>
        );
      })}
    </ListOfCardsLayout>
  );
}

export default ListOfAdvertisingCards;
