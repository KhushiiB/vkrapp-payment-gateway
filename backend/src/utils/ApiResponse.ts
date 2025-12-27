import { type Request, type Response, type NextFunction } from 'express';

interface ApiResult<T> {
  data?: T;
  message?: string;
  status?: number;
}

const ApiResponse =
  <T>(fn: (req: Request, res: Response) => Promise<ApiResult<T>>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data = null, message, status = 200 } = await fn(req, res);

      res.status(status).send(data);
    } catch (err) {
      return next(err);
    }
  };

export default ApiResponse;
