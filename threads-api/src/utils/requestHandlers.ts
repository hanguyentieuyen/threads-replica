import { Request, Response, NextFunction, RequestHandler } from 'express'
// create common try/catch for all controllers
// handler: push all errors to index app
export const requestHandler = <P>(func: RequestHandler<P, any, any, any>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
