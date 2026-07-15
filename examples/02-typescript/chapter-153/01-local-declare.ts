export {};

declare function buildReportName(title: string): string;

function printDeclaredApiUsage(title: string): string {
  return buildReportName(title);
}

console.log(typeof printDeclaredApiUsage);

