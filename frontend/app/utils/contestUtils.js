// Shared utility functions for contest formatting

export const formatPrizeAmount = (amount) => {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(0)} Crore`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(2)} Lakhs`;
  // if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
};

export const formatSpots = (spots) => {
  if (spots >= 10000) {
    return spots.toLocaleString().replace(/,/g, ',');
  }
  return spots.toString();
};

export const calculateFillPercentage = (currentSize, totalSpots) => {
  return totalSpots > 0 ? ((currentSize / totalSpots) * 100) : 0;
};

export const calculateWinnerPercentage = (noOfWinners, totalSpots) => {
  return totalSpots > 0 ? Math.round((noOfWinners / totalSpots) * 100) : 0;
};

export const calculateSpotsLeft = (totalSpots, currentSize) => {
  return Math.max(0, totalSpots - currentSize);
};

export const isPracticeContest = (contest) => {
  return contest.contestCategory === 'free' || contest.entryFee === 0;
};
