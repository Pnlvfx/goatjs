import * as z from 'zod/v4';

export const configureGlobalZodError = () => {
  z.config({
    customError: (iss) => {
      switch (iss.code) {
        case 'invalid_value': {
          return `Invalid value: expected ${iss.values.join(', ')}, received ${JSON.stringify(iss.input)}`;
        }
        case 'invalid_type': {
          return `Invalid type: expected ${iss.expected}, received ${JSON.stringify(iss.input)}`;
        }
        case 'invalid_format': {
          return `Invalid format: expected ${iss.format}, received ${iss.input ?? '"Empty"'}`;
        }
        case 'unrecognized_keys': {
          const keyValuePairs = iss.keys.map((key) => `${key}: ${JSON.stringify(iss.input?.[key])}`);
          return `Unrecognized keys: ${keyValuePairs.join(', ')}`;
        }
        case 'too_small': {
          const bound = `minimum ${iss.minimum.toString()}${iss.inclusive ? ' (inclusive)' : ' (exclusive)'}`;
          return `Too small: ${bound}, received ${JSON.stringify(iss.input)}`;
        }
        case 'too_big': {
          const bound = `maximum ${iss.maximum.toString()}${iss.inclusive ? ' (inclusive)' : ' (exclusive)'}`;
          return `Too big: ${bound}, received ${JSON.stringify(iss.input)}`;
        }
        case 'not_multiple_of': {
          return `Not a multiple of ${iss.divisor.toString()}, received ${JSON.stringify(iss.input)}`;
        }
        case 'invalid_union': {
          const branchSummaries = iss.errors.map((branchErrors, i) => {
            const details = branchErrors
              .map((e) => {
                const inputStr = 'input' in e && e.input !== undefined ? `, received ${JSON.stringify(e.input)}` : '';
                const path = e.path.length > 0 ? ` at ${e.path.join('.')}` : '';
                return `${e.message}${inputStr}${path}`;
              })
              .join('; ');
            return `branch ${(i + 1).toString()}: [${details}]`;
          });
          return `Invalid union (received ${JSON.stringify(iss.input)}): ${branchSummaries.join(' | ')}`;
        }
        default: {
          // Always append the input so no error is ever blind
          const inputStr = 'input' in iss && iss.input !== undefined ? ` (received ${JSON.stringify(iss.input)})` : '';
          return `${iss.message ?? ''}${inputStr}`;
        }
      }
    },
  });
};
