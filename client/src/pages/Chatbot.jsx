import { useState } from 'react';
import axios from 'axios';
import { FaCopy } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import { apiRoutes } from '../utils/apiRoutes';
import Markdown from '../component/Markdown';

const formDataInitialState ={
  ingredients:'',
  mealType:'',
  cuisine:'',
  complexity:'',
}
const responseDataInitial = {
  _id:null,
  complexity:null,
  cuisine:null,
  ingredients:null,
  isFavorite:false,
  mealType:null,
  recipe:null,
  createdAt:null,
}
function Chatbot() {
  const [formData,setFormData] = useState(formDataInitialState)
  const [loading, setLoading] = useState(false);  
  
  const [data,setData ] = useState(responseDataInitial)

  async function generateAnswer(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(apiRoutes.createNewConversation,{
        ingredients:formData.ingredients,
        mealType:formData.mealType,
        cuisine:formData.cuisine,
        complexity:formData.complexity,
        prompt:""
      },{withCredentials:true});
      console.log("res: ",res.data)
      setData(()=>({...res.data.data}))

    
      setLoading(false);
    } catch (error) {
      console.log("error while generating answer",error);
      setLoading(false);
    }

  }


  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.recipe);
    alert('Copied to clipboard!');
  };

  const handleFavorite = async() => {
    try {
      const res = await axios.patch(apiRoutes.saveConversation,{
        // recipeId:data._id,
        // isFavorite:!data.isFavorite
        saveConversationId:data._id,
        isSaved:!data.isFavorite
      },{withCredentials:true})
      console.log("res from favorite: ",res.data)
      setData((prev)=>({...prev,isFavorite:!prev.isFavorite}))
    } catch (error) {
     console.log("error while updating favorite",error) 
    }
  };
  
  return (
    <div className="bg-white min-h-screen p-3">
      <form
        onSubmit={generateAnswer}
        className="w-full md:w-2/3 flex flex-col items-center mx-auto text-center rounded bg-gray-50 py-2 mt-4 shadow-md"
      >

        <textarea
          required
          className="border rounded w-11/12 my-2 min-h-fit p-3 shadow-inner"
          value={formData.ingredients}
          onChange={(e) => setFormData({...formData, ingredients:e.target.value})}
          placeholder="Enter ingredients"
        ></textarea>
        <select
          required
          className="border rounded w-11/12 my-2 p-3 shadow-inner"
          value={formData.mealType}
          onChange={(e) => setFormData({...formData, mealType:e.target.value})}
        >
          <option value="" disabled>
            Select meal type
          </option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
        <select
          required
          className="border rounded w-11/12 my-2 p-3 shadow-inner"
          value={formData.cuisine}
          onChange={(e) => setFormData({...formData, cuisine:e.target.value})}
        >
          <option value="" disabled>
            Select cuisine
          </option>
          <option value="pakistani">Pakistani</option>
          <option value="italian">Italian</option>
          <option value="mexican">Mexican</option>
        </select>
        <select
          required
          className="border rounded w-11/12 my-2 p-3 shadow-inner"
          value={formData.complexity}
          onChange={(e) => setFormData({...formData, complexity:e.target.value})}
        >
          <option value="" disabled>
            Select complexity
          </option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-all duration-300"
          disabled={loading}
        >
          Send{loading && 'ing...'}
        </button>
      </form>

     {data.recipe && 
      <div className=" w-full    rounded bg-blue-600 pt-12 pb-4 px-4 mt-5 shadow-md relative">
      
      <Markdown styles={" text-white  rounded  "}loading={loading}>{data.recipe}</Markdown>

        {data.recipe&& (
          <div className="absolute top-0 right-0 flex space-x-2">
            <button
              onClick={copyToClipboard}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300 flex items-center"
            >
              <FaCopy className="mr-1" /> Copy
            </button>
            <button
              onClick={() => handleFavorite()}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all duration-300 flex items-center"
            >
              <FaHeart
                className="mr-1"
                style={{ color: data.isFavorite? 'red' : 'white' }}
              />
              Favorite
            </button>
          </div>
        )}
      </div>
}
    </div>
  );
}

export default Chatbot;
