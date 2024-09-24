import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiRoutes } from "../utils/apiRoutes";
import moment from "moment";
import { GoHeartFill,GoHeart } from "react-icons/go";
import { AiFillDelete } from "react-icons/ai";
import { IoIosArrowDown,IoIosArrowUp } from "react-icons/io";
import Markdown from "../component/Markdown";
import { timeFromNow } from "../utils/utils";
const pageInitialState = {
  skip: 0,
  limit: 10,
};
const HistoryPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(pageInitialState);
  const [isLoadComplete, setIsLoadComplete] = useState(false);
  const [itemClicked, setItemClicked] = useState(null)
  // const [currentDate, setCurrentDate] = useState(timeFromNow(new Date()))
  const currentDate =useRef(timeFromNow(new Date()))
 
  useEffect(() => {
    async function fetchData() {
      if(loading || isLoadComplete) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `${apiRoutes.getAllRecipes}?skip=${page.skip}&limit=${page.limit}`,
          { withCredentials: true }
        );
        setData((prev)=>([...prev, ...res.data.data]));
        console.log("data ",data)
        setIsLoadComplete(res.data.data.length<page.limit)
        console.log("isLoadComplete: ",isLoadComplete)
        setLoading(false);
      } catch (error) {
        console.log("error while fetching data", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  const handleScroll = ()=>{
    if(window.innerHeight+window.scrollY>=document.body.scrollHeight -1 && !loading){
      setPage((prev)=>({...prev,skip:prev.skip+prev.limit}))
    }
  }

  useEffect(()=>{
    window.addEventListener('scroll',handleScroll)
    return ()=>window.removeEventListener('scroll',handleScroll);
  },[loading])

  const handleFavorite = useCallback(async(recipeId,isFavorite)=>{
    try {
      const res = await axios.patch(apiRoutes.updateRecipeFavorite,{
        recipeId,
        isFavorite
      },{withCredentials:true})
      // now update the data
      if(res.status===200){

        const updatedData = data.map(item=>{
          if(item._id===recipeId){
            return {...item,isFavorite}
          }
          return item
        })
        console.log("updatedData: ",updatedData)  
        setData(updatedData)
      }
    } catch (error) {
     console.log("error while updating favorite",error) 
    }
},[])
  const handleDelete =useCallback(async(recipeId)=>{
    try {
      const res = await axios.delete(`${apiRoutes.deleteRecipe}/${recipeId}`,{withCredentials:true},)
      // now update the data
      if(res.status===200){
        const updatedData = data.filter(item=>item._id!==recipeId)
        setData(updatedData)
      }
    } catch (error) {
      console.log("error while deleting recipe",error)

    }
},[])

const handleItemClicked = useCallback((itemId)=>{
  if(itemId!==itemClicked){
    setItemClicked(itemId)
  }
  else{
    setItemClicked(null)
  }
},[itemClicked])
  
  return (
    <div className="">
      <h1 className="text-3xl text-center mt-4 mb-3">My Recipes</h1>
    <div className= "w-full flex flex-col items-center justify-normal bg-blue-500  gap-y-2 px-1.5 py-3.5 rounded ">
      {
      data.map(item=>{
          const tempDate = timeFromNow(item.createdAt)
          const shouldDateDisplay = currentDate.current!==tempDate
          currentDate.current = tempDate
          return(
              <div key={item._id}>
                {shouldDateDisplay && <p className="bg-white inline  text-xs md:text-sm mt-2  px-2 rounded  ">{tempDate}</p>}
              <RecipeItem  item={item} itemClicked={itemClicked} handleItemClicked={handleItemClicked}  handleFavorite={handleFavorite} handleDelete={handleDelete}/>
            </div>
            )
})
      }
      {
        loading && <p className="text-center text-white">Loading...</p>
      }
      {
        (data.length>0 && isLoadComplete) && <p className="text-center text-white">No more recipes</p>
      }{
        data.length===0 && <p className="text-center text-white">No recipes found</p>
      }
    </div>
    </div>

  );
};

export default HistoryPage;


const RecipeItem = (props)=>{
  const {complexity,
    _id,
    recipe, 
    ingredients,
    cuisine,
    isFavorite,
    mealType,
    createdAt,
    } = props.item
    const [loading,setLoading] = useState(false)

    const handleFavorite = async()=>{
      setLoading(true)
      await props.handleFavorite(_id,!isFavorite)
      setLoading(false)
    }
    const handleDelete = async()=>{
      setLoading(true)
      await props.handleDelete(_id,!isFavorite)
      setLoading(false)
    }
    const itemClickedHandler = ()=>{
      props.handleItemClicked(_id)

    }
    
  return(
    <div className="flex flex-col min-w-min   bg-blue-600 rounded  ">
      <div className=" flex items-center justify-between  h-5  px-2 md:px-4">
        <p className="min-w-[80%]  md:min-w-[90%]    overflow-hidden text-ellipsis text-nowrap  text-white ">
      {props.itemClicked!==_id && ingredients}</p>
       <div className="min-w-[20%] md:min-w-[10%]  flex flex-row items-center justify-between ">

        <button onClick={handleFavorite} disabled={loading} className={`${loading? "cursor-progress":"cursor-pointer"}`}>
        {
          isFavorite ? <GoHeartFill className="text-red-500"/> : <GoHeart className="text-white hover:text-red-500 duration-100 ease-linear"/>
        }
        </button>
        <button onClick={handleDelete} disabled={loading}>
          <AiFillDelete className="text-red-500 hover:text-red-600 duration-100 ease-linear"/>
        </button>
        <button onClick={itemClickedHandler} className="">
          <IoIosArrowDown className={`${props.itemClicked===_id?"rotate-180":"rotate-0"}  text-white duration-100 ease-in-out`}/>
        </button>
       </div>

      </div>
      <div
      className={`${props.itemClicked===_id?"max-h-min ":"max-h-0 "} h-full w-full  duration-200 overflow-hidden bg-blue-500/90 px-2 md:px-4 `}
      >
        <p className="text-lg md:text-xl font-semibold  text-white">Date: <span className="bg-blue-600 px-2 rounded text-base md:text-lg font-normal  text-white">{moment(createdAt).format("LLLL")}</span></p> 
        <p className="text-lg md:text-xl font-semibold  text-white capitalize">complexity: <span className=" bg-blue-600 px-2 rounded text-base md:text-lg font-normal  text-white">{complexity}</span> </p>
        <p className=" text-lg md:text-xl font-semibold  text-white capitalize">cuisine: <span className=" bg-blue-600 px-2 rounded text-base md:text-lg font-normal  text-white">{cuisine}</span> </p>
        <p className="text-lg md:text-xl font-semibold  text-white capitalize">Meal Type: <span className=" bg-blue-600 px-2 rounded text-base md:text-lg font-normal  text-white">{mealType}</span> </p>
        <p className="text-lg md:text-xl font-semibold  text-white">Ingredients: <span className=" bg-blue-600 px-2 rounded text-base md:text-lg font-normal  text-white">{ingredients} </span> </p>

        <div className=" mt-2">
          <p className="text-lg md:text-xl font-semibold text-center text-white">Recipe</p>
         <Markdown styles={"bg-blue-600 text-white border border-white/20 rounded px-2 py-1 "}>{recipe}</Markdown>
       
        </div>
      </div>
    </div>
  )
}
