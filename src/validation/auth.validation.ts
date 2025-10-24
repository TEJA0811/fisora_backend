import  { type Request, type Response, type NextFunction } from 'express'



export function loginValidation(req: Request, res: Response, next: NextFunction) {
    // TODO: put validation
    next()
}

export function registerValidation(req: Request, res: Response, next: NextFunction) {
    // TODO: put validation

    // TODO: validate phone number
    // TODO: validate password 
    var isValide = true 
    var error = "Invalide phone number"

    if(isValide) {
        next()
    } else {
        return res.status(401).json({ message: error });
    }

}

export function OTPValidation(req: Request, res: Response, next: NextFunction) {
    // TODO: put validation
    next()
}

export function updatePasswordValidation(req: Request, res: Response, next: NextFunction) {
    // TODO: put validation
    next()
}

export function getOTPValidation(req: Request, res: Response, next: NextFunction) {
    // TODO: put validation
    next()
}