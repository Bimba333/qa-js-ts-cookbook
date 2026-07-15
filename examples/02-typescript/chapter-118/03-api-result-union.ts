export {};

type ApiResult =
  | { status: 'success'; statusCode: number }
  | { status: 'error'; message: string };

function printApiResult(result: ApiResult): void {
  if (result.status === 'success') {
    console.log(result.statusCode);
  } else {
    console.log(result.message);
  }
}

printApiResult({ status: 'success', statusCode: 200 });
