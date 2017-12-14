module.exports = {
  parseTimeAgo(then) {
    const now = Date.now();

    let difference, nowMonth, thenMonth, nowYear, thenYear;

    if (then + 1000 >= now) {
      return "now";
    }

    difference = now - then;

    // seconds
    difference = Math.floor(difference / 1000);
    if (difference < 60) {
      return difference + "s";
    }

    // minutes
    difference = Math.floor(difference / 60);
    if (difference < 60) {
      return difference + "m";
    }

    // hours
    difference = Math.floor(difference / 60);
    if (difference < 24) {
      return difference + "h";
    }

    // days
    difference = Math.floor(difference / 24);
    if (difference === 1) {
      return "1 day ago";
    } else if (difference < 7) {
      return difference + " days ago";
    }

    // weeks
    difference = Math.floor(difference / 7);
    if (difference === 1) {
      return "1 week ago";
    } else if (difference < 5) {
      return difference + " weeks ago";
    }

    // only calculate these if we get this far
    nowMonth = new Date(now).getMonth();
    thenMonth = new Date(then).getMonth();
    nowYear = new Date(now).getFullYear();
    thenYear = new Date(then).getFullYear();

    // months
    if (nowYear === thenYear) {
      if (nowMonth - thenMonth === 1) {
        return "1 month ago";
      }

      return nowMonth - thenMonth + " months ago";
    } else if (nowYear - thenYear === 1 && nowMonth < thenMonth) {
      if (nowMonth === 0 && thenMonth === 11) {
        return "1 month ago";
      }

      return nowMonth - thenMonth + 12 + " months ago";
    }

    // years
    if (nowYear - thenYear === 1) {
      return "1 year ago";
    }

    return nowYear - thenYear + " years ago";
  }
}
