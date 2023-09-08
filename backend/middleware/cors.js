const {
  NODE_ENV = 'dev',
  FRONT_URL = 'gostgas6.nomoredomainsicu.ru',
} = process.env;
const allowedCors = [
  `http://${FRONT_URL}`,
  `https://${FRONT_URL}`,
  'http://localhost:3000',
  'https://localhost:3000',
];

if (NODE_ENV === 'dev') {
  allowedCors.push('*');
}

const defaultAllowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];

  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', defaultAllowedMethods);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};
