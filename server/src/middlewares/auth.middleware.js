import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshTokens } from "../controllers/user.controller.js";
import { cookiesOptions, print } from "../utils/index.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get accessToken from cookie or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            print("Token not found")
            print("req.cookies: ",req.cookies)
            throw new ApiError(401, "Unauthorized request - Token not found");
        }


        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            // If token is expired, check if refresh token exists. only for cookies
            if (error.name === 'TokenExpiredError') {
                const refreshToken = req.cookies?.refreshToken

                if (!refreshToken) {
                    throw new ApiError(401, "Refresh token not found");
                }

                let decodedRefreshToken;
                try {
                    decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                } catch (error) {
                    throw new ApiError(401, "Invalid or expired refresh token");
                }

                // Find user with decoded refresh token
                const user = await User.findById(decodedRefreshToken._id).select("-password -recipes");
               print("user from auth: ",user)
                if (!user || user.refreshToken !== refreshToken) {
                    throw new ApiError(401, "Invalid refresh token or user not found");
                }

                // Generate new tokens and update the refresh token in the database
                const { accessToken, refreshToken:newRefreshToken } =await generateAccessAndRefreshTokens(user._id);

                // Send new access and refresh tokens
                res.cookie('accessToken', accessToken, cookiesOptions);
                res.cookie('refreshToken', newRefreshToken, cookiesOptions);

                // Attach user to request and proceed
                req.user = user;
                return next();
            } else {
                throw new ApiError(401, "Invalid access token");
            }
        }


        // If token is valid, find user and proceed
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -recipes");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        // Attach user to the request object
        req.user = user;
        next();

    } catch (error) {
        next(new ApiError(401, error?.message || "Unauthorized"));
    }
});