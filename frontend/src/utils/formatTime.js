import { formatDistanceToNowStrict } from 'date-fns';

export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  
  // Calculate difference in hours
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  // If more than 24 hours, show in days
  if (diffInHours >= 24) {
    return formatDistanceToNowStrict(date, { addSuffix: true, unit: 'day' });
  } 

  // Otherwise, show in hours
  return formatDistanceToNowStrict(date, { addSuffix: true, unit: 'hour' });
}