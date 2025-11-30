/* eslint-disable no-console */
import { createCacheKey } from '@goatjs/cache';
import { camelizeObject } from '@goatjs/core/object/camel';
import { input } from '@goatjs/node/input';
import { storage } from '@goatjs/storage';
import { dbz } from '@goatjs/dbz/dbz';
import { getProjectTsConfig } from '@goatjs/dbz/typescript/read';
import { deepStrictEqual } from '@goatjs/deep-diff/assert';

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
        const deckSpriteKebab = {
          '2c': { left: 200, top: 144, width: 70, height: 97 },
          '2d': { left: 300, top: 0, width: 70, height: 97 },
          '2h': { left: 300, top: 97, width: 70, height: 97 },
          '2s': { left: 370, top: 0, width: 70, height: 97 },
          '3c': { left: 370, top: 97, width: 70, height: 97 },
          '3d': { left: 0, top: 288, width: 70, height: 97 },
          '3h': { left: 70, top: 288, width: 70, height: 97 },
          '3s': { left: 140, top: 288, width: 70, height: 97 },
          '4c': { left: 210, top: 288, width: 70, height: 97 },
          '4d': { left: 280, top: 288, width: 70, height: 97 },
          '4h': { left: 350, top: 288, width: 70, height: 97 },
          '4s': { left: 440, top: 0, width: 70, height: 97 },
          '5c': { left: 440, top: 97, width: 70, height: 97 },
          '5d': { left: 440, top: 194, width: 70, height: 97 },
          '5h': { left: 0, top: 385, width: 70, height: 97 },
          '5s': { left: 70, top: 385, width: 70, height: 97 },
          '6c': { left: 140, top: 385, width: 70, height: 97 },
          '6d': { left: 210, top: 385, width: 70, height: 97 },
          '6h': { left: 280, top: 385, width: 70, height: 97 },
          '6s': { left: 350, top: 385, width: 70, height: 97 },
          '7c': { left: 420, top: 385, width: 70, height: 97 },
          '7d': { left: 510, top: 0, width: 70, height: 97 },
          '7h': { left: 510, top: 97, width: 70, height: 97 },
          '7s': { left: 510, top: 194, width: 70, height: 97 },
          '8c': { left: 510, top: 291, width: 70, height: 97 },
          '8d': { left: 0, top: 482, width: 70, height: 97 },
          '8h': { left: 70, top: 482, width: 70, height: 97 },
          '8s': { left: 140, top: 482, width: 70, height: 97 },
          '9c': { left: 210, top: 482, width: 70, height: 97 },
          '9d': { left: 280, top: 482, width: 70, height: 97 },
          '9h': { left: 350, top: 482, width: 70, height: 97 },
          '9s': { left: 420, top: 482, width: 70, height: 97 },
          ac: { left: 490, top: 482, width: 70, height: 97 },
          ad: { left: 580, top: 0, width: 70, height: 97 },
          ah: { left: 580, top: 97, width: 70, height: 97 },
          as: { left: 580, top: 194, width: 70, height: 97 },
          'blank-card': { left: 580, top: 291, width: 70, height: 97 },
          'card-back': { left: 580, top: 388, width: 70, height: 97 },
          'four-color-jc': { left: 650, top: 0, width: 70, height: 97 },
          'four-color-jd': { left: 650, top: 97, width: 70, height: 97 },
          'four-color-kc': { left: 650, top: 194, width: 70, height: 97 },
          'four-color-kd': { left: 650, top: 291, width: 70, height: 97 },
          'four-color-qc': { left: 650, top: 388, width: 70, height: 97 },
          'four-color-qd': { left: 0, top: 579, width: 70, height: 97 },
          jc: { left: 70, top: 579, width: 70, height: 97 },
          jd: { left: 140, top: 579, width: 70, height: 97 },
          jh: { left: 210, top: 579, width: 70, height: 97 },
          js: { left: 280, top: 579, width: 70, height: 97 },
          kc: { left: 350, top: 579, width: 70, height: 97 },
          kd: { left: 420, top: 579, width: 70, height: 97 },
          kh: { left: 490, top: 579, width: 70, height: 97 },
          ks: { left: 560, top: 579, width: 70, height: 97 },
          'mobile-card-2-colour': { left: 0, top: 0, width: 100, height: 144 },
          'mobile-card-4-colour-clubs': { left: 100, top: 0, width: 100, height: 144 },
          'mobile-card-4-colour-diamonds': { left: 200, top: 0, width: 100, height: 144 },
          'mobile-card-4-colour-hearts': { left: 0, top: 144, width: 100, height: 144 },
          'mobile-card-4-colour-spades': { left: 100, top: 144, width: 100, height: 144 },
          'mobile-rank-2-small': { left: 790, top: 640, width: 44, height: 44 },
          'mobile-rank-2': { left: 70, top: 676, width: 80, height: 80 },
          'mobile-rank-3-small': { left: 790, top: 684, width: 44, height: 44 },
          'mobile-rank-3': { left: 150, top: 676, width: 80, height: 80 },
          'mobile-rank-4-small': { left: 790, top: 728, width: 44, height: 44 },
          'mobile-rank-4': { left: 230, top: 676, width: 80, height: 80 },
          'mobile-rank-5-small': { left: 720, top: 582, width: 44, height: 44 },
          'mobile-rank-5': { left: 310, top: 676, width: 80, height: 80 },
          'mobile-rank-6-small': { left: 720, top: 626, width: 44, height: 44 },
          'mobile-rank-6': { left: 390, top: 676, width: 80, height: 80 },
          'mobile-rank-7-small': { left: 650, top: 485, width: 44, height: 44 },
          'mobile-rank-7': { left: 470, top: 676, width: 80, height: 80 },
          'mobile-rank-8-small': { left: 650, top: 529, width: 44, height: 44 },
          'mobile-rank-8': { left: 550, top: 676, width: 80, height: 80 },
          'mobile-rank-9-small': { left: 580, top: 485, width: 44, height: 44 },
          'mobile-rank-9': { left: 630, top: 676, width: 80, height: 80 },
          'mobile-rank-a-small': { left: 580, top: 529, width: 44, height: 44 },
          'mobile-rank-a': { left: 710, top: 676, width: 80, height: 80 },
          'mobile-rank-j-small': { left: 510, top: 388, width: 44, height: 44 },
          'mobile-rank-j': { left: 790, top: 0, width: 80, height: 80 },
          'mobile-rank-k-small': { left: 510, top: 432, width: 44, height: 44 },
          'mobile-rank-k': { left: 790, top: 80, width: 80, height: 80 },
          'mobile-rank-q-small': { left: 440, top: 291, width: 44, height: 44 },
          'mobile-rank-q': { left: 790, top: 160, width: 80, height: 80 },
          'mobile-rank-t-small': { left: 440, top: 335, width: 44, height: 44 },
          'mobile-rank-t': { left: 790, top: 240, width: 80, height: 80 },
          'mobile-suit-club-small': { left: 370, top: 194, width: 44, height: 44 },
          'mobile-suit-club': { left: 790, top: 320, width: 80, height: 80 },
          'mobile-suit-diamond-small': { left: 370, top: 238, width: 44, height: 44 },
          'mobile-suit-diamond': { left: 790, top: 400, width: 80, height: 80 },
          'mobile-suit-heart-small': { left: 300, top: 194, width: 44, height: 44 },
          'mobile-suit-heart': { left: 790, top: 480, width: 80, height: 80 },
          'mobile-suit-spade-small': { left: 300, top: 238, width: 44, height: 44 },
          'mobile-suit-spade': { left: 790, top: 560, width: 80, height: 80 },
          qc: { left: 630, top: 579, width: 70, height: 97 },
          qd: { left: 720, top: 0, width: 70, height: 97 },
          qh: { left: 720, top: 97, width: 70, height: 97 },
          qs: { left: 720, top: 194, width: 70, height: 97 },
          'simple-2': { left: 863, top: 684, width: 7, height: 12 },
          'simple-3': { left: 862, top: 696, width: 7, height: 12 },
          'simple-4': { left: 854, top: 696, width: 8, height: 12 },
          'simple-5': { left: 834, top: 714, width: 7, height: 12 },
          'simple-6': { left: 841, top: 714, width: 7, height: 12 },
          'simple-7': { left: 848, top: 714, width: 7, height: 12 },
          'simple-8': { left: 855, top: 714, width: 7, height: 12 },
          'simple-9': { left: 862, top: 714, width: 7, height: 12 },
          'simple-a': { left: 857, top: 670, width: 9, height: 12 },
          'simple-c': { left: 854, top: 640, width: 12, height: 12 },
          'simple-card-back': { left: 834, top: 640, width: 20, height: 30 },
          'simple-card': { left: 834, top: 684, width: 20, height: 30 },
          'simple-d': { left: 854, top: 652, width: 12, height: 12 },
          'simple-h': { left: 834, top: 670, width: 12, height: 12 },
          'simple-j': { left: 834, top: 728, width: 7, height: 12 },
          'simple-k': { left: 841, top: 728, width: 7, height: 12 },
          'simple-q': { left: 848, top: 728, width: 7, height: 12 },
          'simple-s': { left: 846, top: 670, width: 11, height: 12 },
          'simple-t': { left: 854, top: 684, width: 9, height: 12 },
          tc: { left: 720, top: 291, width: 70, height: 97 },
          td: { left: 720, top: 388, width: 70, height: 97 },
          th: { left: 720, top: 485, width: 70, height: 97 },
          ts: { left: 0, top: 676, width: 70, height: 97 },
        };
        console.log({ deck: camelizeObject(deckSpriteKebab) });
        break;
      }
      case '3': {
        const persistentCacheStore = await createCacheKey('test', {
          type: 'json',
          fn: () => {
            return ['2', '3', '4'];
          },
          keys: ['test'],
          persist: true,
          debug: true,
          expiresIn: 10 * 60 * 1000,
        });

        console.log(await persistentCacheStore.query());
        break;
      }
      case '4': {
        await dbz.unpublish('@poker/replayer-images');
        break;
      }
      case '5': {
        const tsConfigs = getProjectTsConfig();
        console.log({ tsConfigs });
        break;
      }
      case '6': {
        deepStrictEqual({ name: 'john', age: 10 }, { name: 'joh', age: 10 });
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }

  void run();
};

void run();
