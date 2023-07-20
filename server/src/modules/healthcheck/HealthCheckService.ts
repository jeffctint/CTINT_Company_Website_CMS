export const checkServerHealth = async () => {
  const body = {
    upTime: process.uptime(),
    responseTime: process.hrtime(),
    status: 'OK',
    timestamp: Date.now(),
  };
  return body;
};
