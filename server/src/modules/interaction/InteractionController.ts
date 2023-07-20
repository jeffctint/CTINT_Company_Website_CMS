import { Request, Response } from 'express';
import { getInteractions, getInteractionDetailById, downloadAttachment, getContactBySearch, getQueueBySearch } from './InteractionService';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@/utils/logger';

// Supply the input parameters with default values
export const findInteractions = async (req: Request, res: Response): Promise<any> => {
  // get the request header and pass it to the service
  const user = {
    name: req.headers['gc-user-name'] as string,
    email: req.headers['gc-user-email'] as string,
    userId: req.headers['gc-user-id'] as string,
  };

  // Log the user body
  logger.info(`USER: ${JSON.stringify(user, null, 2)}`);

  const { list, rowCount, pageCount } = await getInteractions(req.body);
  res.status(StatusCodes.OK).json({ data: list, total: rowCount, pageCount, message: 'findAllMatchHistory', isSuccess: true });
};

// Get interaction detail by interaction id
export const findInteractionDetailById = async (req: Request, res: Response): Promise<any> => {
  // get the request header and pass it to the service
  const user = {
    name: req.headers['gc-user-name'] as string,
    email: req.headers['gc-user-email'] as string,
    userId: req.headers['gc-user-id'] as string,
  };
  const body = {
    id: req.params.id,
    ...user,
  };
  const result = await getInteractionDetailById(body);
  res.status(StatusCodes.OK).json({ data: result, message: 'findOneDetail', isSuccess: true });
};

// Download attachment by attachment id
export const downloadAttachmentById = async (req: Request, res: Response): Promise<any> => {
  // get the request header and pass it to the service
  const user = {
    name: req.headers['gc-user-name'] as string,
    email: req.headers['gc-user-email'] as string,
    userId: req.headers['gc-user-id'] as string,
  };

  // Log the user body
  logger.info(`USER: ${JSON.stringify(user, null, 2)}`);

  const fileName = await downloadAttachment(req.params.id);
  res.status(StatusCodes.OK).json({ data: fileName, message: 'findOneAttachment', isSuccess: true });
};

// Get contact list by search input
export const getContactList = async (req: Request, res: Response): Promise<any> => {
  // get the request header and pass it to the service
  const user = {
    name: req.headers['gc-user-name'] as string,
    email: req.headers['gc-user-email'] as string,
    userId: req.headers['gc-user-id'] as string,
  };

  // Log the user body
  logger.info(`USER: ${JSON.stringify(user, null, 2)}`);

  const result = await getContactBySearch(req.query.searchInput as string);
  res.status(StatusCodes.OK).json({ data: result, message: 'findContact', isSuccess: true });
};

export const getQueueList = async (req: Request, res: Response): Promise<any> => {
  // get the request header and pass it to the service
  const user = {
    name: req.headers['gc-user-name'] as string,
    email: req.headers['gc-user-email'] as string,
    userId: req.headers['gc-user-id'] as string,
  };

  // Log the user body
  logger.info(`USER: ${JSON.stringify(user, null, 2)}`);

  const result = await getQueueBySearch(req.query.searchInput as string);
  res.status(StatusCodes.OK).json({ data: result, message: 'findQueue', isSuccess: true });
};
export { getInteractions };
