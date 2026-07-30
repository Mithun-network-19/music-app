/**
 * Utility helper functions for AuraSound Backend
 * Add shared helpers, formatters, and validators here.
 */

/**
 * Format duration string to seconds
 * @param {string} duration - Duration in "mm:ss" format
 * @returns {number} Duration in seconds
 */
const durationToSeconds = (duration) => {
  if (!duration || typeof duration !== 'string') return 0;
  const parts = duration.split(':');
  if (parts.length !== 2) return 0;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  return (minutes * 60) + seconds;
};

/**
 * Format seconds to duration string
 * @param {number} totalSeconds - Duration in seconds
 * @returns {string} Duration in "mm:ss" format
 */
const secondsToDuration = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

module.exports = {
  durationToSeconds,
  secondsToDuration
};
