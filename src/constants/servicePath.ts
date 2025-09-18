import { Service } from "@/types/common.type";

export type ServicePath = {
  path: string;
} & Service;

export const SERVICE_PATH: ServicePath[] = [
  { path: "paraphrase", service: "paraphrase" },
  { path: "summarize", service: "summary" },
  { path: "citation", service: "cite" },
];
