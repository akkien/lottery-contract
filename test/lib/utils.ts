export const time = {
  now: () => {
    return Math.floor(new Date().getTime() / 1000);
  },
  timeFromNow: (second: number) => {
    return Math.floor(new Date().getTime() / 1000) + second;
  },
};
