import RestaurantCard, { TopRatedRestaurants } from "./RestaurantCard";
import RestaurantMenu from "./RestaurantMenu";
import { useState, useEffect, useContext } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utilities/useOnlineStatus";
import UserContext from "../utilities/UserContext";
// import { useParams } from "react-router-dom";

const Body = () => {
  let [listOfRestaurants, setlistOfRestaurants] = useState([]);
  let [filteredListOfRestaurants, setfilteredListOfRestaurants] = useState([]);
  let [searchText, setsearchText] = useState('');
  let { setUserName, loggedInUser } = useContext(UserContext);

  const TopRated = TopRatedRestaurants(RestaurantCard);
  // var id = useParams();
  // console.log(id);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await fetch("/api/restaurants");

    const json = await data.json();

    setlistOfRestaurants(
      json.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );

    setfilteredListOfRestaurants(
      json.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );

  };

  const onlineStatus = useOnlineStatus();

  if (!onlineStatus) {
    return (
      <h1 className="font-bold text-3xl px-5">
        {" "}
        Looks like you are offline... Please check your internet connection{" "}
      </h1>
    );
  }

  return listOfRestaurants == 0 ? (
    <Shimmer />
  ) : (
    <div className="">
      <div className="flex p-3 items-center ">
        <button
          className="border-solid border-2 border-black rounded-md p-1 text-base font-medium mr-10 hover:bg-gray-200"
          onClick={() => {
            const filteredlist = listOfRestaurants.filter(
              (restau) => restau?.info?.avgRating > 4.5
            );
            setfilteredListOfRestaurants(filteredlist);
          }}
        >
          Top Rated Restaurent
        </button>
        <input
          data-testid='searchInput'
          role="textbox"
          className="border-solid border-[1px] border-black rounded-md bg-slate-200"
          type="text"
          value={searchText}
          onChange={(e) => {
            setsearchText(e.target.value);
          }}
        />
        <button
          className="mx-4 border-solid border-2 border-black rounded-md p-1 text-base font-medium ml-1 hover:bg-gray-200"
          data-testid='searchButton'
          onClick={() => {
            const filteredlist = listOfRestaurants.filter((res) => {
              const words = res?.info?.name?.toLowerCase().split(" ");
              return words.some((word) =>
                word.startsWith(searchText.toLowerCase())
              );
            });
            setfilteredListOfRestaurants(filteredlist);
          }}
        >
          Search
        </button>
        <label className="font-semibold text-lg mx-1"> UserName : </label>
        <input
          className="border-2 border-black rounded-md px-1"
          value={loggedInUser}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div
        role="group"
        data-testid="resCard"
        className="flex flex-wrap justify-center items-center py-10 gap-x-8 gap-y-2">
        {filteredListOfRestaurants?.length > 0 ? (
          filteredListOfRestaurants.map((restaurant) => (
            <Link
              className=""
              to={"/restaurants/" + restaurant.info.id}
              key={restaurant.info.id}
            >
              {restaurant.info.avgRating > 4.4 ? (
                <TopRated resData={restaurant} />) : (
                <RestaurantCard resData={restaurant} />)
              }

            </Link>
          ))
        ) : (
          <p>No restaurants found</p>
        )}
      </div>
    </div>
  );
};
export default Body;
