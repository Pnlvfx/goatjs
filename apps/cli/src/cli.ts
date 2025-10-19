/* eslint-disable no-console */
import { input } from '@goatjs/node/input';
import { storage } from '@goatjs/storage';

const run = async () => {
  try {
    const text = await input.create({ title: '1. Write your code and test it.' });

    switch (text) {
      case '1': {
        const dir = await storage.use('exxx');
        console.log({ dir });
        break;
      }
      case '2': {
        console.log('No handler');
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }

  void run();
};

void run();
