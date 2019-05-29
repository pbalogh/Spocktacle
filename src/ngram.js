import corpus from "./moby-dick";

const ngrams = {};

const ORDER = 5;

// for (let i = 0; i < 1300; i++) {
//   const ngram = corpus.substring(i, i + ORDER);
//   const nextChar = corpus.charAt(i + ORDER);
//   ngrams[ngram] = ngrams[ngram] || [];
//   ngrams[ngram].push(nextChar);
// }

// console.log("ngrams are ", ngrams);

// const getRandomFromMap = map => {
//   const keys = Object.keys(map);
//   return getRandomFromArr(keys);
// };

// const getRandomFromArr = arr => arr[Math.floor(Math.random() * arr.length)];

// const seed = getRandomFromMap(ngrams);
// console.log("seed is " + seed);
// let sentence = seed;
// let lastNgram = seed;

// for (let i = 0; i < 130; i++) {
//   lastNgram = sentence.substring(i, i + ORDER);
//   console.log("lastNgram is " + lastNgram);
//   console.log("ngrams[lastNgram] is ", ngrams[lastNgram]);
//   const newChar = getRandomFromArr(ngrams[lastNgram]);
//   console.log("Adding newChar " + newChar);
//   sentence += newChar;
//   console.log("sentence is now:   " + sentence);
// }

export default ngrams;
