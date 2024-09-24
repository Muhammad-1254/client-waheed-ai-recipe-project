import { Router } from "express"
import { createRecipe, deleteRecipe, getAllRecipes, getRecipe, updateRecipeFavorite } from "../controllers/recipe.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()


router.route("/createRecipe").post(verifyJWT,createRecipe)
router.route("/getAllRecipes").get(verifyJWT,getAllRecipes)
router.route("/getRecipe/:id").get(verifyJWT,getRecipe)


// patch
router.route("/updateRecipe/favorite").patch(verifyJWT,updateRecipeFavorite)

// delete
router.route("/deleteRecipe/:id").delete(verifyJWT,deleteRecipe)

export default router    
