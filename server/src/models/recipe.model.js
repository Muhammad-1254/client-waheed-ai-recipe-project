import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    ingredients: { type: String, required: true },
    mealType: { type: String, required: true },
    cuisine: { type: String, required: true },
    complexity: { type: String, required: true },
    recipe: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


export const Recipe = mongoose.model("Recipe", recipeSchema);
