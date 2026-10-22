import { CookieOptions } from "express";
import { envConfig } from "../../../infrastructure/config/env.config";

export const accessTokenCookie: CookieOptions = {
    httpOnly: true,
    secure: envConfig.isProduction,
    sameSite: "lax",
    maxAge: envConfig.ACCESS_TOKEN_COOKIE_MAX_AGE_MS,
    path: "/"
};

export const refreshTokenCookie: CookieOptions = {
    httpOnly: true,
    secure: envConfig.isProduction,
    sameSite: "lax",
    maxAge: envConfig.REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
    path: "/api/auth"
};

export const clearAccessTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: envConfig.isProduction,
    sameSite: "lax",
    path: "/"
};

export const clearRefreshTokenCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: envConfig.isProduction,
    sameSite: "lax",
    path: "/api/auth"
};

export const registrationCookie: CookieOptions = {
    httpOnly: true,
    secure: envConfig.isProduction,
    sameSite: "lax",
    maxAge: envConfig.REGISTRATION_COOKIE_MAX_AGE_MS,
    path: "/"
};
