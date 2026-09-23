import { Request,Response,NextFunction } from "express"

class CustomerAuthController {
    constructor () {}
    async register(req:Request,res:Response,next:NextFunction){
        return res.json({message:"Hey this is from controller"})
    }
}



export default CustomerAuthController