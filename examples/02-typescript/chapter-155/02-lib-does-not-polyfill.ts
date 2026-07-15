export {};

type RuntimeFeatureNote = {
  option: "lib";
  createsRuntimeApi: false;
};

const note: RuntimeFeatureNote = {
  option: "lib",
  createsRuntimeApi: false,
};

console.log(`${note.option}: ${note.createsRuntimeApi}`);

