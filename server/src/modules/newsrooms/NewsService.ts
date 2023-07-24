import { sqlDatetime, sqlInt, sqlNVarChar, sqlRequest } from '@/database/connection';
import { logger } from '@utils/logger';
import path from 'path';
import fs from 'fs';

interface ResourceProps {
  name: string;
  website: string;
}

interface CreateNewsProps {
  newsTitle: string;
  newsContent: string;
  newsDate: Date;
  resourceList?: string;
  relatedNewsList?: ResourceProps[];
  newsStatus?: string;
  createUserPkey?: string;
  imageName?: string[];
}

export const getNewsList = async ({}): Promise<any> => {
  const request = await sqlRequest();
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'getInteractions',
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_getNewsroomList');

  console.log('result', result);
  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    list: result,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const getNewsDetailByPkey = async ({ pkey }: any) => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('pkey', sqlNVarChar, pkey);

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'getInteractionDetailById',
    // user: {
    //   userId,
    //   name,
    //   email,
    // },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_getNewsroomByPkey');
  console.log(result);
  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    result: result,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const createNews = async ({
  newsTitle,
  newsContent,
  newsDate,
  resourceList,
  relatedNewsList,
  newsStatus,
  createUserPkey,
  imageName,
}: CreateNewsProps): Promise<any> => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('newsTitle', sqlNVarChar, newsTitle);
  request.input('newsContent', sqlNVarChar, newsContent);
  request.input('newsDate', sqlDatetime, newsDate);
  request.input('resourceList', sqlNVarChar, resourceList);
  request.input('relatedNewsList', sqlNVarChar, relatedNewsList);
  request.input('newsStatus', sqlNVarChar, newsStatus);
  request.input('createUserPkey', sqlNVarChar, createUserPkey);
  request.input('imageName', sqlNVarChar, imageName);

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  // Create the log body for the logger
  const logBody = {
    action: 'createNews',
    news: {
      newsTitle,
      newsContent,
      newsDate,
      resourceList,
      relatedNewsList,
      newsStatus,
      createUserPkey,
      imageName,
    },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));
  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_createNewsroom');
  console.log(result);
  // Get the resultCode and errMsg
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    result: result,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};
