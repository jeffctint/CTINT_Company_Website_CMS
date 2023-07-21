import dayjs from 'dayjs';
import { sqlDatetime, sqlInt, sqlNVarChar, sqlRequest } from '@/database/connection';
import { logger } from '@utils/logger';
import path from 'path';
import fs from 'fs';
const IP = require('ip');

type InteractionFilterBody = {
  searchInput: string;
  startDate: string;
  endDate: string;
  agent: string;
  status: string;
  pageIndex: number;
  pageSize: number;
};
/**
 * Get interactions with optional query parameters
 */
export const getInteractions = async ({
  // searchInput,
  // startDate,
  // endDate,
  // agent,
  // status,
  // pageIndex,
  // pageSize,
}: InteractionFilterBody): Promise<any> => {
  const request = await sqlRequest();

  // Set the input parameters, but only include parameters if it is not null
  // if (searchInput) {
  //   request.input('search_input', sqlNVarChar, searchInput.trim());
  // }
  // // Include the start time
  // if (startDate) {
  //   const start = dayjs(startDate).format('YYYY-MM-DD HH:mm:ss');
  //   request.input('start_date', sqlDatetime, start);
  // }
  // // Include the end time and add 1 day
  // if (endDate) {
  //   const end = dayjs(endDate).add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
  //   request.input('end_date', sqlDatetime, end);
  // }
  // // Include the last updated agent id
  // if (agent) {
  //   request.input('last_updated_agent_id', sqlNVarChar, agent.trim());
  // }

  // // Include the email status. If it is not null, then it means that the user has selected a status, either 'In progress' or 'Done'
  // if (status) {
  //   request.input('email_status', sqlInt, Number(status));
  // }

  // Include the page size and page number as input parameters
  // request.input('keyword', sqlNVarChar, '');
  // request.input('page_index', sqlInt, Number(pageIndex));
  // request.input('page_index', sqlInt, Number(pageIndex));

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);
  // request.output('total_pages', sqlInt);

  // Create the log body for the logger
  const logBody = {
    action: 'getInteractions',
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.p_newsroom_getNewsroomList');

  console.log("result", result)
  // Get the row count and page count
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  // Return the recordset for a single statement and do some data transformation
  return {
    list: result.recordsets[0],
    rowCount: resultCode ?? 0,
    pageCount: errMsg ?? '',
  };
};

/**
 * Get interaction detail by interaction id
 */
export const getInteractionDetailById = async ({ id, userId, name, email }: any) => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('interaction_id', sqlNVarChar, id);

  // Set the output parameters
  request.output('result_code', sqlInt);

  // Create the log body for the logger
  const logBody = {
    action: 'getInteractionDetailById',
    user: {
      userId,
      name,
      email,
    },
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.get_interaction_detail');

  /**
   * Return the recordsets for multiple statements
   * The first recordset is the interaction detail: recordset[0]
   * The second recordset is the attachment for the interaction: recordset[1]
   *
   * Do a mapping so that the attachment is an array of attachment objects, and append it to the interaction object
   */
  const interaction = result.recordsets[0][0];
  const attachment = result.recordsets[1];

  return {
    ...interaction,
    attachments: attachment,
  };
};

/**
 * Get attachment by id from db
 */
const getAttachmentById = async (id: string): Promise<any> => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('attachment_id', sqlNVarChar, id);

  // Set the output parameters
  request.output('result_code', sqlInt);

  // Create the log body for the logger
  const logBody = {
    action: 'getAttachmentById',
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.get_interaction_attachment_by_id');

  /**
   * Return the recordsets for single statements
   * The first recordset is the attachment detail: recordset[0][0]
   */
  const attachment = result.recordsets[0][0];

  // Log the attachment
  // logger.info(`Attachment: ${JSON.stringify(attachment, null, 2)}`);

  return attachment;
};

/**
 * Download attachment by attachment id
 */
export const downloadAttachment = async (id: string): Promise<any> => {
  // Create the log body for the logger
  const logBody = {
    action: 'downloadAttachment',
    inputParameters: {
      id,
    },
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Get the attachment object from db by id
  const attachment = await getAttachmentById(id);

  // attachment.Content is a binary data column, so we need to decode it to a base64 string
  const binaryString = Buffer.from(attachment.Content, 'binary').toString('base64');

  // File path to be downloaded to: e.g. public/attachmentname.png
  const filePath = path.join(process.cwd(), 'public', attachment.TheName);

  // Log the file path
  logger.info(`To be downloaded - File path: ${filePath}`);

  // Create the directory if it does not exist
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    // Write the file to the file path
    logger.info(`Writing file to ${filePath}`);
    fs.writeFileSync(filePath, binaryString, 'base64');
  }

  // If the file already exists, no need to write it again
  fs.writeFileSync(filePath, binaryString, 'base64');

  return attachment.TheName;
};

/**
 * Get contact by search input (first or last name) from DB
 */
export const getContactBySearch = async (searchInput: string): Promise<any> => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('search_input', sqlNVarChar, searchInput);

  // Set the output parameters
  request.output('result_code', sqlInt);

  // Create the log body for the logger
  const logBody = {
    action: 'getContactBySearch',
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.get_contacts');

  /**
   * Return the recordsets for single statements
   */
  const contactList = result.recordsets[0];

  // Data transformation
  const mappedContactList = contactList.map(({ Id, AgentFullName, StrAttribute3 }: any) => {
    return {
      id: Id,
      name: AgentFullName,
      email: StrAttribute3,
    };
  });

  // Log the response
  // logger.info(`Returned Contacts: ${JSON.stringify(contactList, null, 2)}`);

  return mappedContactList;
};

export const getQueueBySearch = async (searchInput: string): Promise<any> => {
  const request = await sqlRequest();

  // Set the input parameters
  request.input('search_input', sqlNVarChar, searchInput);

  // Set the output parameters
  request.output('result_code', sqlInt);

  // Create the log body for the logger
  const logBody = {
    action: 'getQueueBySearch',
    inputParameters: request.parameters,
  };

  // Log the logBody
  logger.info(JSON.stringify(logBody, null, 2));

  // Execute the stored procedure
  const result = await request.execute('dbo.get_queues');

  /**
   * Return the recordsets for single statements
   */
  const queueList = result.recordsets[0];

  // Data transformation
  const mappedQueueList = queueList.map(({ Id, StrAttribute2, StrAttribute3 }: any) => {
    return {
      id: Id,
      queueLabel: StrAttribute2,
      queueName: StrAttribute3,
    };
  });

  // Log the response
  // logger.info(`Returned Queues: ${JSON.stringify(queueList, null, 2)}`);

  return mappedQueueList;
};
