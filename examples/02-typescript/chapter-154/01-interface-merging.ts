export {};

interface ReportMeta {
  title: string;
}

interface ReportMeta {
  status: "passed" | "failed";
}

const meta: ReportMeta = {
  title: "login",
  status: "passed",
};

console.log(meta.title, meta.status);

