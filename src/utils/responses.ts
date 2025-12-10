import { Response } from 'express';
 export interface BaseMetaResponse {
  totalDocs: number;
  skip: number;
  page: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}


export const success = <T>(
  res: Response,
  { data, message = "Success", status = 200,meta }: { data?: T; message?: string; status?: number,meta?: BaseMetaResponse}
) => {
  if(meta){
    return res.status(status).json({ success: true, message, data, meta });
  }
  return res.status(status).json({ success: true, message, data });
};


export const error = (res: Response, { message = 'Something went wrong', status = 500, details = null } = {}) =>
  res.status(status).json({ success: false, message, details });
