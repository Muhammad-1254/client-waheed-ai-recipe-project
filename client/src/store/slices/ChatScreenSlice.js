import { createSlice } from "@reduxjs/toolkit";

const messages = [
  { role: "user", content: "Give me a recipe for chocolate chip cookies." },
  {
    role: "assistant",
    content:
      "Here's a simple recipe for delicious chocolate chip cookies:\n\nIngredients:\n- 2 1/4 cups all-purpose flour\n- 1 tsp baking soda\n- 1 tsp salt\n- 1 cup unsalted butter, softened\n- 3/4 cup granulated sugar\n- 3/4 cup brown sugar\n- 2 large eggs\n- 2 tsp vanilla extract\n- 2 cups semi-sweet chocolate chips\n\nInstructions:\n1. Preheat oven to 375°F (190°C).\n2. In a bowl, mix flour, baking soda, and salt.\n3. In another bowl, cream together butter, granulated sugar, and brown sugar.\n4. Beat in eggs and vanilla to the butter mixture.\n5. Gradually stir in the flour mixture.\n6. Fold in chocolate chips.\n7. Drop rounded tablespoons of dough onto ungreased baking sheets.\n8. Bake for 9-11 minutes or until golden brown.\n9. Let cool on baking sheet for 2 minutes, then transfer to a wire rack.\n\nEnjoy your homemade chocolate chip cookies!",
  },
  { role: "user", content: "Can you suggest a healthier version?" },
  {
    role: "assistant",
    content:
      "Of course! Here's a healthier version of chocolate chip cookies:\n\nIngredients:\n- 1 1/2 cups whole wheat pastry flour\n- 1/2 tsp baking soda\n- 1/4 tsp salt\n- 1/3 cup coconut oil, melted\n- 1/2 cup coconut sugar\n- 1 large egg\n- 1 tsp vanilla extract\n- 1/4 cup unsweetened applesauce\n- 1/2 cup dark chocolate chips\n\nInstructions:\n1. Preheat oven to 350°F (175°C).\n2. In a bowl, mix flour, baking soda, and salt.\n3. In another bowl, whisk coconut oil and coconut sugar.\n4. Beat in egg, vanilla, and applesauce.\n5. Gradually stir in the flour mixture.\n6. Fold in dark chocolate chips.\n7. Drop rounded tablespoons of dough onto a parchment-lined baking sheet.\n8. Bake for 10-12 minutes or until edges are lightly browned.\n9. Let cool on baking sheet for 5 minutes, then transfer to a wire rack.\n\nThis version uses whole wheat flour for more fiber, coconut oil instead of butter, coconut sugar as a natural sweetener, and applesauce to reduce the fat content. The dark chocolate chips provide antioxidants. Enjoy your healthier cookies!",
  },
];

export const chatScreenInitialState = {
  chatId: null,
  ingredients: [],
  mealType: "any",
  complexity: "any",
  cuisine: "any",
  messages: [],
  createdAt: null,
  messageLoading: false,
};

const chatSlice = createSlice({
  name: "chatScreen",
  initialState:chatScreenInitialState,
  reducers: {
    setChatScreenData: (state, action) => {
      for (const key in action.payload) {
        state[key] = action.payload[key];
      }
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setIngredients: (state, action) => {
      state.ingredients = action.payload;
    },
    setCuisine: (state, action) => {
      state.cuisine = action.payload;
    },
    setComplexity: (state, action) => {
      state.complexity = action.payload;
    },
    setMealType: (state, action) => {
      state.mealType = action.payload;
    },
    setMessageLoading: (state, action) => {
      state.messageLoading = action.payload;
    }

    
  },
});

export const { setMessages,setMessageLoading, setChatScreenData,setIngredients,setComplexity,setCuisine,setMealType } =
  chatSlice.actions;
export default chatSlice.reducer;
