const SERVER_DOMAIN_DEV = import.meta.env.VITE_SERVER_DOMAIN_DEV;
const SERVER_DOMAIN_PROD = import.meta.env.VITE_SERVER_DOMAIN_PROD;

const domain =
  import.meta.env.VITE_NODE_ENV === "development"
    ? SERVER_DOMAIN_DEV
    : SERVER_DOMAIN_PROD;


const prefix = `${domain}/api/v1`;

export const apiRoutes = {
  // post
  signup: `${prefix}/users/register`,
  login: `${prefix}/users/login`,
  logout: `${prefix}/users/logout`,
  refreshToken: `${prefix}/users/refresh-token`,
  changePassword: `${prefix}/users/change-password`,

  createNewConversation: `${prefix}/gpt/createNewConversation`,
  addConversationMessage: `${prefix}/gpt/addConversationMessage`,

  // get
  getUser: `${prefix}/users/current-user`,
  getAllConversations: `${prefix}/gpt/getAllConversations`,
  getConversation: `${prefix}/gpt/getConversation`,
  searchConversations: `${prefix}/gpt/searchConversations`,

  // patch
  saveConversation: `${prefix}/gpt/saveConversation`,

  //delete
  deleteConversation: `${prefix}/gpt/deleteConversation`,
};
