import { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Cross, Plus } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  setChatScreenData,
  setComplexity,
  setCuisine,
  setIngredients,
  setMealType,
} from "../store/slices/ChatScreenSlice";

const Selection = () => {
  const { chatId } = useSelector((state) => state.chatScreen);
  const [isRecipeFixed, setIsRecipeFixed] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (chatId) {
      setIsRecipeFixed(true);
    }else{
      setIsRecipeFixed(false);
    }
  }, [chatId]);

  const setMealTypeHandler = (value) => {
    dispatch(setMealType(value));
  };

  const setComplexityHandler = (value) => {
    dispatch(setComplexity(value));
  };

  const setCuisineHandler = (value) => {
    dispatch(setCuisine(value));
  };

  return (
    <div className="w-full mt-4 md:mt-8">
      {isRecipeFixed ? (
        <RecipeDetailsDisplay isRecipeFixed={isRecipeFixed} />
      ):(
        <>
          <div
            className={` w-full  flex flex-col md:flex-row  items-start justify-center gap-y-3 md:gap-y-0 md:justify-center md:gap-x-3
        
        `}
          >
              <IngredientsInput />
            <div className="flex flex-wrap md:flex-nowrap  gap-3">
              <SelectInput
                label={"Meal Type"}
                values={["breakfast", "lunch", "dinner", "snack", "any"]}
                setValue={setMealTypeHandler}
              />
              <SelectInput
                label={"Complexity"}
                values={["easy", "medium", "hard","any"]}
                setValue={setComplexityHandler}
              />
              <SelectInput
                label={"Cuisine"}
                values={["asian", "american", "european", "african","any"]}
                setValue={setCuisineHandler}
              />
            </div>
          </div>
          <Ingredients />
        </>
      ) }
    </div>
  );
};

export default Selection;

const IngredientsInput = () => {
  const { ingredients } = useSelector((state) => state.chatScreen);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const addIngredientsHandler = () => {
    if (value.length > 0) {
      dispatch(setIngredients([...ingredients, value]));
      setValue("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addIngredientsHandler();
    }
  };
  return (
    <div className="w-full  max-w-sm flex  items-center  ">
      <Input
        onKeyDown={handleKeyDown}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        placeholder="Please Add Some Ingredients"
        className=""
      />
      <Button
        variant="outline"
        className="p-2 "
        onClick={addIngredientsHandler}
      >
        <Plus size={24} />
      </Button>
    </div>
  );
};

const Ingredients = () => {
  const { ingredients } = useSelector((state) => state.chatScreen);
  const dispatch = useDispatch();

  const removeIngredientHandler = (value) => {
    dispatch(setIngredients(ingredients.filter((v) => v !== value)));
  };
  return (
    <div
      className={`px-4 mt-2 rounded-lg ${
        ingredients.length === 0 ? "bg-background" : "bg-secondary"
      }`}
    >
      {ingredients.length === 0 ? null : (
        <div className="py-2">
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold ">
            Ingredients
          </h3>

          <ScrollArea className=" w-full   h-32 md:h-40">
            <div className="flex flex-wrap  gap-x-2 gap-y-2">
              {ingredients?.map((value, _) => (
                <Badge
                  key={_}
                  className={"max-w-min flex items-center select-none"}
                >
                  <span className="md:text-lg ">{value}&nbsp;&nbsp;</span>

                  <Cross1Icon
                    size={16}
                    onClick={() => removeIngredientHandler(value)}
                  />
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

const RecipeDetailsDisplay = () => {
  const { mealType, complexity, cuisine,ingredients } = useSelector(
    (state) => state.chatScreen
  );
  return (
    <div className={`w-full md:max-w-[90%]  flex  mx-auto`}>
      <div className="flex flex-col gap-y-2">
        <div className="flex gap-x-2">
        <p className="">Meal Type: </p>
        <Badge>{mealType}</Badge>
        </div>
        <div className="flex gap-x-2">
        <p className="">Complexity: </p>
        <Badge>{complexity}</Badge>
        </div>
        <div className="flex gap-x-2">
        <p className="">Cuisine: </p>
        <Badge>{cuisine}</Badge>
        </div>
        
        <div className="flex gap-x-2">
          <p className="">Ingredients: </p>
          <div className="flex flex-wrap gap-2">
          {ingredients.map((value, _) => (
            <Badge key={_}>{value}</Badge>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const SelectInput = ({ values, label, setValue }) => {
  return (
    <Select  onValueChange={(v) => setValue(v)}>
      <SelectTrigger className="">
        <SelectValue className="capitalize" placeholder={`Select a ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {values.map((value, i) => (
            <SelectItem key={i} value={value} className="">
              <span className="capitalize">{value}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
