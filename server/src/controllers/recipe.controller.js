import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError} from "../utils/ApiError.js";
import axios from "axios";
import { Recipe } from "../models/Recipe.model.js";
import { User } from "../models/user.model.js";




export const createRecipe = asyncHandler(async (req,res)=>{
    const {ingredients, mealType, cuisine, complexity} = req.body;
    console.log("createRecipe: ",ingredients, mealType, cuisine, complexity)
    if(!ingredients || !mealType || !cuisine || !complexity){
        throw new ApiError(400, "Please provide all the required fields")
    }
    const query = `
    Your Role is Chef.\nYou can also embed Youtube video or any other image embed platform. Your You have to reply with a recipe\n\nYou have to use the following ingredients: ${ingredients}\n\nYou have to make a ${mealType} dish\n\nThe cuisine should be ${cuisine}\n\nThe complexity should be ${complexity}\n
    `;
    const gptRes = await axios({
        url: process.env.TEXT_GPT_URI,
        method: 'post',
        data: {
          contents: [{ parts: [{ text: query }] }],
        },
      });
    console.log("gptRes: ",gptRes.data)
    const ans =  gptRes.data.candidates[0].content.parts[0].text;

    const recipe = new Recipe({
      ingredients,
      mealType,
      cuisine,
      complexity,
      recipe: ans,
      user: req.user._id
    })
    await recipe.save()
    return res
    .status(200)
    .json(new ApiResponse(200, recipe, "Recipe created successfully"))
})

export const getAllRecipes = asyncHandler(async (req,res)=>{
    const skip = req.query.skip 
    const limit = req.query.limit 
    console.log("skip: ",skip, "limit: ",limit  )
    if (isNaN(skip) || isNaN(limit)) {
        throw new ApiError(400, "Invalid query params")
    }
    const recipes = await Recipe.find({
        user: req.user._id
    }).sort({createdAt: -1})
    .skip(skip).limit(limit)
    

    return res
    .status(200)
    .json(new ApiResponse(200, recipes, "Recipes fetched successfully"))

})

export const getRecipe = asyncHandler(async (req,res)=>{
  const recipeId = req.params.id
    const recipe = await Recipe.findById(recipeId)
    if(!recipe){
        throw new ApiError(404, "Recipe not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, recipe, "Recipe fetched successfully"))
})

export const updateRecipeFavorite = asyncHandler(async (req,res)=>{
  const {recipeId,isFavorite} = req.body
  if(!recipeId || isFavorite === undefined){
    console.log("recipeId: ",recipeId, "isFavorite: ",isFavorite)
      throw new ApiError(400, "Please provide all the required fields")
  }
  const recipe = await Recipe.findById(recipeId)
  if(!recipe){
      throw new ApiError(404, "Recipe not found")
  }
  recipe.isFavorite = isFavorite
  await recipe.save()
  return res
  .status(200)
  .json(new ApiResponse(200, recipe, "Recipe updated successfully"))

})


export const deleteRecipe = asyncHandler(async (req,res)=>{
  const recipeId = req.params.id
  const recipe = await Recipe.findById(recipeId)
  if(!recipe){
      throw new ApiError(404, "Recipe not found")
  }
  await recipe.deleteOne()
  return res
  .status(200)
  .json(new ApiResponse(200, recipe, "Recipe deleted successfully"))
})

