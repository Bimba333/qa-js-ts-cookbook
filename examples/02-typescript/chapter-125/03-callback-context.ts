export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

type ReportContext = {
  prefix: string;
};

function formatWithContext(this: ReportContext, message: string): string {
  return `${this.prefix} ${message}`;
}

// @ts-expect-error this context is required for this call.
console.log(formatWithContext('ready'));
