export const autogigFunctions = [
  {
    name: "get_applicant_info",
    description:
      "Retrieves applicants information from the resume based on the parameters provided",
    parameters: {
      required: ["name", "email", "phone"],
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the applicant (i.e John Doe)",
        },
        email: {
          type: "string",
          description: "The email address of the applicant",
        },
        phone: {
          type: "string",
          description: "The phone number of the applicant (i.e 123-456-7890)",
        },
        address: {
          type: "string",
          description:
            "The address of the applicant (i.e 123 Main St, New York, NY 10001)",
        },
        organization: {
          type: "string",
          description: "The organization of the applicant",
        },
        github: {
          type: "string",
          description:
            "The link to the github profile of the applicant (i.e. https://github.com/josh)",
        },
        linkedin: {
          type: "string",
          description:
            "The link to the linkedin profile of the applicant (i.e. https://linkedin.com/in/josh)",
        },
        portfolio: {
          type: "string",
          description: "The link to the portfolio of the applicant",
        },
        location: {
          type: "string",
          description: "The location of the applicant (i.e. New York, NY)",
        },
        school: {
          type: "string",
          description: "The school of the applicant (i.e. Harvard University)",
        },
        startDate: {
          type: "string",
          description:
            "The desired start date of the applicant (i.e. May 2019)",
        },
        compensation: {
          type: "string",
          description:
            "The compensation desired for the applicant (i.e $100k/yr)",
        },
      },
    },
  },
];
