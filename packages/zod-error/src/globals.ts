import { z } from 'zod';

export const configureGlobalZodError = () => {
  z.config({
    customError: (iss) => {
      switch (iss.code) {
        case 'invalid_value': {
          return `Invalid value: expected ${iss.values.join(' ')}, received ${JSON.stringify(iss.input)}`;
        }
        case 'invalid_type': {
          return `Invalid type: expected ${iss.expected}, received ${JSON.stringify(iss.input)}`;
        }
        case 'invalid_format': {
          return `Invalid format: expected ${iss.format}, received ${iss.input}`;
        }
        default: {
          return iss.message;
        }
      }
    },
  });
};
