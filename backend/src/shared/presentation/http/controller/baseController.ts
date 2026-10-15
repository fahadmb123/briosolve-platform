import type { Request } from "express";
import { IUserTokenPayload } from "../../../domain/interfaces/IToken";
import { ApplicationError } from "../../../application/errors/applicationError";



export abstract class BaseController {
    protected getCurrentUser(req:Request):IUserTokenPayload{
        if(!req.user) throw new ApplicationError("UNAUTHERIZED","Unautherized","AUTHORIZATION")
        return req.user;
    }
}