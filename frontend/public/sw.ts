import { Serwist } from "serwist";

const serwist = new Serwist({
  precacheEntries: self.__RSC_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
});

serwist.addEventListeners();
