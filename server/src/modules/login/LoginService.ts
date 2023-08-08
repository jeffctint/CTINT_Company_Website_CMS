import { sqlDatetime, sqlInt, sqlNVarChar, sqlRequest } from '@/database/connection';
import { logger } from '@utils/logger';

interface LoginProps {
  email: string;
  password: string;
}

interface LogoutProps {
  email: string;
}

export const login = async ({ email, password }: LoginProps) => {
  const request = await sqlRequest();

  request.input('email', sqlNVarChar, email);
  request.input('password', sqlNVarChar, password);

  // Set the output parameters
  request.output('resultCode', sqlInt);
  request.output('errMsg', sqlNVarChar);

  const logBody = {
    action: 'loginWithEmailAndPassword',

    inputParameters: request.parameters,
  };

  logger.info(JSON.stringify(logBody, null, 2));

  const result = await request.execute('rbac.sp_login_customCheckUserPasswordAndEmail');

  const user = result.recordsets[0];
  const resultCode = result.output.resultCode;
  const errMsg = result.output.errMsg;

  // Log the total rows and page count
  logger.info(`Result code: ${resultCode} and Errmsg: ${errMsg}`);

  return {
    result: user,
    resultCode: resultCode ?? 0,
    errMsg: errMsg ?? '',
  };
};

export const logout = async ({ email }: LogoutProps) => {
  const request = await sqlRequest();

  request.input('email', sqlNVarChar, email);

  const logBody = {
    action: 'logout with email',

    inputParameters: request.parameters,
  };

  logger.info(JSON.stringify(logBody, null, 2));

  const result = await request.execute('rbac.sp_login_customUpdateLogoutDatetimeByEmail');

  return {
    result: result,
  };
};
