import { useParams } from 'react-router-dom';

const DRecipe = () => {
  const { recipeId } = useParams();

  return (
    <div>
      <h1>recipe</h1>
      <p>Welcome, {recipeId}!</p>
    </div>
  );
};

export default DRecipe;
