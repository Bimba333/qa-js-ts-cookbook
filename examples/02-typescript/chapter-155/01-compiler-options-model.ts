export {};

type CompilerOptionsModel = {
  target: "ES2020" | "ES2022";
  module: "ES2020" | "ES2022";
  noEmit: boolean;
};

const options: CompilerOptionsModel = {
  target: "ES2022",
  module: "ES2022",
  noEmit: true,
};

console.log(options.target, options.module, options.noEmit);

