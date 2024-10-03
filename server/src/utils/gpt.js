import axios from "axios";
import { GOOGLE_IMG_SCRAP } from "google-img-scrap";

export const toolsFunctionNames = {
  fetchYoutubeVideos: "fetchYoutubeVideos",
  fetchImages: "fetchImages",
};

export const recipeConversationTools = [
  {
    type: "function",
    function: {
      name: toolsFunctionNames.fetchYoutubeVideos,
      description:
        "This function fetches video data from the YouTube Data API based on a search query. It retrieves metadata for videos like title, description, channel information, and more.",
      parameters: {
        type: "object",
        properties: {
          q: {
            type: "string",
            description:
              "The search query term to find relevant YouTube videos.",
          },
          maxResults: {
            type: "integer",
            description:
              "The maximum number of video results to return. Default is 5.",
            default: 5,
          },
          type: {
            type: "string",
            description:
              "The type parameter restricts a search query to only retrieve a particular type of resource. The value is video, channel, or playlist.",
            default: "video",
          },
          order: {
            type: "string",
            description:
              "The order parameter specifies the method that will be used to order resources in the API response. The order value can be date, rating, relevance, title, videoCount, viewCount.",
            default: "relevance",
          },
        },
        required: ["q", "type"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: toolsFunctionNames.fetchImages,
      description:
        "This function fetches images from Google Images and returns list of related images based on the search query.",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "The search query term to find relevant images.",
          },
          limit: {
            type: "integer",
            description:
              "The maximum number of image results to return. Default is 5.",
            default: 5,
          },
          excludeWords:{
            type:"object",
            description:"The excludeWords parameter is used to exclude specific words from the search results. This takes an array of strings as input.",
            default:[],
          }
        },
        required: ["search", "limit"],
        additionalProperties: false,
      },
    },
  },
];

export const completionModel = "gpt-4o-mini";
export const completionStartingMessages = [
  {
    role: "system",
    content:
      "You are a helpful assistant here to provide information about the Recipe and related to food and meals. If user asked you about anything else, you can ask them to ask about Recipe and food related questions.You can also use the supplied tools to assist the user, i.e Use iframe to display the videos or fetch images.",
  },
];

export const toolFunctions = {
  fetchYoutubeVideos: async (args) => {
    const queryString = Object.entries(args)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    const url = `${process.env.YOUTUBE_DATA_API_BASE_URI}?key=${process.env.YOUTUBE_DATA_API_KEY}&part=snippet&${queryString}`;
    const recipeRes = await axios.get(url);
    return recipeRes.data;
  },
  fetchImages: async (args) => {   
    const response = await GOOGLE_IMG_SCRAP({
      search: args.search,
      limit: args.limit??5,
      excludeWords: args.excludeWords??[],
      safeSearch: true,
    })
    return response;
  },
};
