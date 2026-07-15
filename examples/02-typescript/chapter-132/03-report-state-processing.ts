export {};

type JobState =
  | { state: "queued" }
  | { state: "running"; attempt: number }
  | { state: "done"; passed: boolean };

function label(state: JobState): string {
  switch (state.state) {
    case "queued":
      return "queued";
    case "running":
      return `attempt ${state.attempt}`;
    case "done":
      return state.passed ? "passed" : "failed";
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}

console.log(label({ state: "running", attempt: 2 }));
