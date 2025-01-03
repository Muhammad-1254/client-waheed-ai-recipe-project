import moment from 'moment';

export const timeFromNow = (date) => {
  const now = moment();
  const inputDate = moment(date);

  const diffInMinutes = now.diff(inputDate, 'minutes');
  const diffInHours = now.diff(inputDate, 'hours');
  const diffInDays = now.diff(inputDate, 'days');
  const diffInWeeks = now.diff(inputDate, 'weeks');
  const diffInMonths = now.diff(inputDate, 'months');
  const diffInYears = now.diff(inputDate, 'years');

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} weeks ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else {
    return `${diffInYears} years ago`;
  }
};
