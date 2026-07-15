export {};

type RequestInfo = {
  endpoint: string;
};

type ApiResult =
  | { status: 'success'; statusCode: number }
  | { status: 'error'; message: string };

type ApiReport = RequestInfo & ApiResult;

const report: ApiReport = {
  endpoint: '/users',
  status: 'success',
  statusCode: 200,
};

console.log(report);
