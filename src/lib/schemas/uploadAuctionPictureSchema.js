const schema = {
  type: "object",
  properties: {
    body: {
      type: "string",
      minLength: 1,
      pattern: "\=$", // checks if the string ends with an equal sign (base64 encoded string)
    },
  },
  required: ["body"],
};

export default schema;
