import readline from 'node:readline';
import { consoleColor, type ConsoleColor } from './console-color.js';

export interface InputOptions {
  title?: string;
  color?: ConsoleColor;
}

let isRunning = false;
let rl: readline.Interface | undefined;
let isAborted = false;

export const input = {
  create: ({ title = 'Welcome! Press Enter to run your function.', color = 'blue' }: InputOptions = {}) => {
    if (isRunning) throw new Error('A script is already running. Please run one script at a time.');
    isRunning = true;

    return new Promise<string>((resolve, reject) => {
      rl = readline.createInterface({ input: process.stdin, output: process.stdout });

      const handleLine = (input: string) => {
        if (!rl) throw new Error('Mismatch on coraline.input');
        rl.close();
        resolve(input);
      };

      rl.on('line', handleLine);

      const close = () => {
        if (!rl) throw new Error('Mismatch on coraline.input');
        rl.off('line', handleLine);
        rl.off('close', close);
        rl.close();
        isRunning = false;
        rl = undefined;
        if (isAborted) reject(new Error('Aborted'));
        isAborted = false;
      };

      rl.on('close', close);

      consoleColor(color, title);
      rl.prompt();
    });
  },
  abort: () => {
    if (rl) {
      isAborted = true;
      rl.close();
    }
  },
};
