import { makeApi } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

export const all = makeApi({
  config,
});

export const prerender = false;
