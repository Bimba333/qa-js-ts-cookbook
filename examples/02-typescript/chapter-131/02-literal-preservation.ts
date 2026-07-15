export {};

type ReportConfig = {
  mode: "summary" | "detailed";
  includePassed: boolean;
};

const reportConfig = {
  mode: "summary",
  includePassed: true,
} satisfies ReportConfig;

const exactMode: "summary" = reportConfig.mode;

console.log(exactMode);
