import { useEffect, useState } from 'react';
import Shimmer from './Shimmer';
import { ResInfoApi1, ResInfoApi2 } from '../utilities/constants';
import { useParams } from 'react-router-dom';
import RestaurantCategory from './RestaurantCategory';
import useRestaurantMenu from '../utilities/useRestaurantMenu';

// this is what will appear after clicking on a restaurant

const RestaurantMenu = () => {
  let [showIndex, setshowIndex] = useState(null);
  const { resid } = useParams();

  let resinfo = useRestaurantMenu(resid);

  if (!resinfo || resinfo.length == 0 || !resinfo?.data) return <Shimmer />;

  const infoCard = resinfo?.data?.cards?.find(
    (c) => c?.card?.card?.info
  )?.card?.card?.info;

  if (!infoCard) return <Shimmer />;

  const {
    name,
    cuisines,
    costForTwoMessage,
    areaName,
    avgRating,
    totalRatingsString,
    sla,
  } = infoCard;

  const regularCards = resinfo?.data?.cards?.find(
    (c) => c?.groupedCard?.cardGroupMap?.REGULAR
  )?.groupedCard?.cardGroupMap?.REGULAR?.cards;

  const Categories =
    regularCards?.filter(
      (c) =>
        c.card?.card?.['@type'] ==
        'type.googleapis.com/swiggy.presentation.food.v2.ItemCategory'
    ) || [];

  // console.log(Categories);

  return (
    <div className="flex flex-col  items-center w-auto">
      <h1 className="font-bold  text-3xl mb-5"> {name} </h1>

      <h1 className="font-medium text-lg">
        {' '}
        ⭐ {avgRating} , {totalRatingsString}{' '}
      </h1>

      <h2 className="font-medium text-lg ">
        {' '}
        {sla.minDeliveryTime}-{sla.maxDeliveryTime} mins{' '}
      </h2>

      <div className="w-6/12">
        {Categories.map((category, index) => (
          <RestaurantCategory
            data={category?.card?.card}
            key={category?.card?.card?.title}
            showItems={index === showIndex}
            setshowIndex={() =>
              setshowIndex(index === showIndex ? null : index)
            }
          />
        ))}
      </div>
    </div>
  );
};
export default RestaurantMenu;
