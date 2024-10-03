import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addConversationMessage, createNewConversation, deleteConversation, getAllConversations, getConversation, saveConversation, searchConversations } from "../controllers/gpt.controller.js";

const router = Router()

router.route("/createNewConversation").post(verifyJWT, createNewConversation)
router.route("/addConversationMessage").post(verifyJWT, addConversationMessage)


router.route("/getAllConversations").get(verifyJWT, getAllConversations)
router.route("/getConversation/:id").get(verifyJWT,getConversation)


router.route("/searchConversations").get(verifyJWT,searchConversations)

router.route("/saveConversation/:id").patch(verifyJWT,saveConversation)


router.route("/deleteConversation/:id").delete(verifyJWT,deleteConversation)



export default router