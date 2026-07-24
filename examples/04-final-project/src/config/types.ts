export const executionProfiles = ["local", "ci"] as const;

export type ExecutionProfile = (typeof executionProfiles)[number];

export type RawEnvironment = Readonly<Record<string, string | undefined>>;

export type RuntimeConfig = Readonly<{
  profile: ExecutionProfile;
  uiBaseUrl: string;
  restBaseUrl: string;
  grpcTarget: string;
  postgresConnectionReference: string;
  credentialReference: string;
  operationTimeoutMs: number;
  artifactDirectory: string;
  isCi: boolean;
  ciRunId?: string;
}>;
