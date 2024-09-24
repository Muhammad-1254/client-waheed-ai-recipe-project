
const prefix = 'http://localhost:8000/api/v1';
export const apiRoutes = {

    // post
    signup:`${prefix}/users/register`,
    login:`${prefix}/users/login`,
    logout:`${prefix}/users/logout`,
    createRecipe:`${prefix}/recipes/createRecipe`,

    

    // get
    getAccessToken:`${prefix}/users/getAccessToken`,
    getUser:`${prefix}/users/current-user`,
    getAllRecipes:`${prefix}/recipes/getAllRecipes`,

    //patch 
    updateRecipeFavorite:`${prefix}/recipes/updateRecipe/favorite`,

    //delete
    deleteRecipe:`${prefix}/recipes/deleteRecipe`,
    
}