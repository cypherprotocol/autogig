import { ChatCompletionFunctions } from "openai";

export const autogigFunctions: ChatCompletionFunctions[] = [
  {
    name: "get_applicant_info",
    description: "Get applicant's information",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Applicant's name",
        },
        email: {
          type: "string",
          description: "Applicant's email",
        },
        phone: {
          type: "string",
          description: "Applicant's phone number",
        },
        address: {
          type: "string",
          description: "Applicant's address",
        },
        organization: {
          type: "string",
          description: "Applicant's organization",
        },
        github: {
          type: "string",
          description: "Applicant's github link",
        },
        linkedin: {
          type: "string",
          description: "Applicant's linkedin link",
        },
        portfolio: {
          type: "string",
          description: "Applicant's portfolio link",
        },
        location: {
          type: "string",
          description: "Applicant's location",
        },
        school: {
          type: "string",
          description: "Applicant's school",
        },
        startDate: {
          type: "string",
          description: "Applicant's desired start date",
        },
      },
    },
  },
];
