export {};

class TestRun {
  constructor(
    public readonly id: string,
    private status: "created" | "finished",
  ) {}

  finish(): void {
    this.status = "finished";
  }

  getStatus(): "created" | "finished" {
    return this.status;
  }
}

const run = new TestRun("run-1", "created");
run.finish();

console.log(run.id, run.getStatus());
