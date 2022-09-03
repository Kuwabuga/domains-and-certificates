import { ENVIRONMENT } from "@/config";

const config: { [index: string]: { domains: string[], certificateRegions: string[]}; } = {
  "development": {
    domains: ["development.kuwabuga.com"],
    certificateRegions: [
      "us-east-1",
      "eu-west-1"
    ]
  },
  "production": {
    domains: ["kuwabuga.com"],
    certificateRegions: [
      "us-east-1",
      "eu-west-1"
    ]
  }
};

export const domains = config[ENVIRONMENT].domains;
export const certificateRegions = config[ENVIRONMENT].certificateRegions;