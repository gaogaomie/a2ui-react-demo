
import { DataItem, ChartType } from '../types';

/**
 * Automatically detects field types and suggests initial config.
 */
export const analyzeData = (data: DataItem[]) => {
  if (!data || data.length === 0) return { xFields: [], yFields: [], suggestion: null };

  const sample = data[0];
  const keys = Object.keys(sample);
  
  const xFields: string[] = []; // Categorical/Temporal candidates
  const yFields: string[] = []; // Numerical candidates

  keys.forEach(key => {
    const val = sample[key];
    if (typeof val === 'number') {
      yFields.push(key);
    } else {
      xFields.push(key);
    }
  });

  // Suggest first categorical as X and first numerical as Y
  const suggestedX = xFields[0] || keys[0];
  const suggestedY = yFields[0] || keys[1];

  return {
    xFields,
    yFields,
    suggestedX,
    suggestedY
  };
};

/**
 * Formats large numbers for display
 */
export const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
