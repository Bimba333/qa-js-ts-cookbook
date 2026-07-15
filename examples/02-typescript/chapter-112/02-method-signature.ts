interface Reporter {
  name: string;
  write(message: string): void;
}

const reporter: Reporter = {
  name: 'console',
  write(message: string): void {
    console.log(`[report] ${message}`);
  },
};

reporter.write('test started');
