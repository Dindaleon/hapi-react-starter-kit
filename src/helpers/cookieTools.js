import config from '../config';
export const getCookie = (cname, server = null) => {
  const name = cname + '=';
  let ca = null;

  if (server === null) {
    ca = document.cookie.split(';');
  } else {
    ca = server.cookie.split(';');
  }

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }

  return '';
};

export const setCookie = (cname, cvalue, exdays) => {
  let ttl = 0;
  if (exdays) {
    ttl = exdays * 24 * 60 * 60 * 1000;
  } else {
    ttl = config.user.session.ttls;
  }
  const d = new Date();
  d.setTime(d.getTime() + (ttl));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + '; ' + expires;
};

export const deleteCookie = (cname) => {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
};
