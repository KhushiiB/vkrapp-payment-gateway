import { Response, Request } from "express";

const notFound = (_: Request, res: Response) => {
  res.status(404).json({
    errorMessage: 'not found',
    code: 404,
    status: false,
    data: [],
  });
};

export default notFound;
