export {};

const reportHelper = {
  prefix: '[report]',
  format(message: string): string {
    return `${this.prefix} ${message}`;
  },
};

console.log(reportHelper.format('ready'));
