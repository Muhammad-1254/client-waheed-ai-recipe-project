import mongoose from "mongoose";


const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['system' ,'user' ,'assistant' ,'tool'], required: true },
  content: { type: String, },
  tool_call_id: { type: String },
  tool_calls: { type: Array },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ingredients: { type: [String], required: true },
  mealType: {
    type: String,
    enum: ["breakfast", "lunch", "dinner", "snack","any"],
    required: true,
  },
  cuisine: { type: String, required: true },
  complexity: {
    type: String,
    enum: ["easy", "medium", "hard", "any"],
    required: true,
  },
  
  messages: [MessageSchema],
  isSaved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});


export const Conversation = mongoose.model("Conversation", ConversationSchema);