import OpenAI from "openai";
import {
  completionModel,
  completionStartingMessages,
  recipeConversationTools,
  toolFunctions,
} from "../utils/gpt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation} from "../models/gptConversation.model.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const validateMessage = (messages) => {
  const validMessages = [];
  for (let i = 0; i < messages.length; i++) {
    const message = {};
    if (messages[i].tool_calls && messages[i].tool_calls.length > 0) {
      message.tool_calls = messages[i].tool_calls;
    }
    if (messages[i].tool_call_id && messages[i].tool_call_id) {
      message.tool_call_id = messages[i].tool_call_id;
    }
    message.role = messages[i].role;
    message.content = messages[i]?.content;
    validMessages.push(message);
  }
  return validMessages;
};

const completionModelConversation = async (messages) => {
  messages = validateMessage(messages);
  console.log("messages: ", messages);
  const response = await openai.chat.completions.create({
    model: completionModel,
    messages,
    tools: recipeConversationTools,
    tool_choice: "auto",
  });
  console.log("finish_reason:", response.choices[0].finish_reason);
  if (response.choices[0].finish_reason === "length") {
    console.log("Error: The conversation was too long for the context window.");
    return {
      status: 400,
      success: false,
      message: "The conversation was too long for the context window.",
    };
  }

  if (response.choices[0].finish_reason === "content_filter") {
    console.log("Error: The content was filtered due to policy violations.");
    return {
      status: 400,
      success: false,
      message: "The content was filtered due to policy violations.",
    };
  }
  if (response.choices[0].finish_reason === "tool_calls") {
    const responseMessage = response.choices[0].message;
    messages.push(responseMessage);
    for (let i = 0; i < responseMessage.tool_calls.length; i++) {
      const toolCall = responseMessage.tool_calls[i];

      if (toolCall.type === "function") {
        const args = JSON.parse(toolCall.function.arguments);
        const toolName = toolCall.function.name;
        const toolRes = await toolFunctions[toolName](args);
        // appending the tool response to the messages
        messages.push({
          role: "tool",
          content: JSON.stringify(toolRes),
          tool_call_id: toolCall.id,
        });
      }
    }

    return {status:200,success:true,flag:1, message:"tool calls processed", messages};
    // Recur if there are tool calls to process
    // return await completionModelConversation([...messages]);
  } else if (response.choices[0].finish_reason === "stop") {
    messages.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });
    return { status: 200, success: true, message: "query completed", messages };
  } else {
    console.log("Unexpected finish_reason:", response);
    return { status: 400, success: false, message: "Unexpected finish_reason" };
  }
};

export const createNewConversation = asyncHandler(async (req, res) => {
  const { ingredients, mealType, cuisine, complexity, prompt } = req.body;
  if (!ingredients || !mealType || !cuisine || !complexity || !prompt) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }

  const messages = [
    ...completionStartingMessages,
    { role: "user", content: JSON.stringify(req.body) },
  ];

  let response = await completionModelConversation(messages);
  if(response.flag===1){
    response = await completionModelConversation(response.messages);
  }
  if (response.status === 400) {
    return res
      .status(400)
      .json({ success: response.success, message: response.message });
  }
  if (response.status === 200) {
    const conversation = await Conversation.create({
      userId: req.user._id,
      ingredients,
      mealType,
      cuisine,
      complexity,
      messages: response.messages,
    });
    await conversation.save();
    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: conversation,
    });
  }
});

export const addConversationMessage = asyncHandler(async (req, res) => {
  const { prompt, conversationId } = req.body;
  if (!conversationId || !prompt) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide all the required fields: { prompt, conversationId }",
    });
  }
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }
  conversation.messages.push({ role: "user", content: prompt });
  let response = await completionModelConversation(conversation.messages);
  if(response.flag===1){
    response = await completionModelConversation(response.messages);
  }
  if (response.status === 400) {
    return res
      .status(400)
      .json({ success: response.success, message: response.message });
  }
  if (response.status === 200) {
    conversation.messages = response.messages;
    await conversation.save();
    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: conversation,
    });
  }
});

export const getAllConversations = asyncHandler(async (req, res) => {
  const skip = req.query.skip ?? 0;
  const limit = req.query.limit ?? 10;

  const conversation = await Conversation.find({
    userId: req.user._id,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return res.status(200).json({
    success: true,
    data: conversation,
  });
});

export const getConversation = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: conversation,
  });
});

export const searchConversations = asyncHandler(async (req, res) => {
  const search = req.query.search;
  if (!search) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }
 const conversations = await Conversation.find({
  userId: req.user._id,
  'messages.role':{$in:["user",]},
  'messages.content':{$regex:search,$options:'i'},
 }).limit(5);
  return res.status(200).json({
    success: true,
    data: conversations,
  });
});

export const saveConversation = asyncHandler(async (req, res) => {
  const { conversationId, isSaved } = req.body;
  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }
  conversation.isSaved = isSaved;
  await conversation.save();
  return res.status(200).json({
    success: true,
    message: "Conversation saved successfully",
    data: conversation,
  });
});
export const deleteConversation = asyncHandler(async (req, res) => {
  const conversationId = req.params.id;
  if (!conversationId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required fields",
    });
  }
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: "Conversation not found",
    });
  }
  await conversation.remove();
  return res.status(200).json({
    success: true,
    message: "Conversation deleted successfully",
    data: conversation,
  });
});
