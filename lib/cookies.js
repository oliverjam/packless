export function create(name, defaults) {
  return {
    read(header) {
      let cookies = parse(header);
      let cookie = cookies.get(name);
      if (!cookie) {
        return "";
      } else {
        return cookie;
      }
    },
    write(value, overrides) {
      let opts = options({ ...defaults, ...overrides });
      return `${name}=${value}; ${opts}`;
    },
    clear() {
      return `${name}=0; MaxAge=0`;
    },
  };
}

function parse(header) {
  let map = new Map();
  if (header) {
    console.log({ header });
    let values = header.split("; ");
    values.forEach((pair) => map.set(...pair.split("=")));
  }
  return map;
}

function options(opts) {
  const attributes = {
    domain: "Domain",
    path: "Path",
    maxage: "Max-Age",
    expires: "Expires",
    samesite: "SameSite",
    secure: "Secure",
    httponly: "HttpOnly",
  };
  return {
    toString() {
      if (opts.path == undefined) {
        opts.path = "/"; // better default!
      }
      let temp = [];
      for (let [key, value] of Object.entries(opts)) {
        let attr = attributes[key.toLowerCase()];
        if (attr) {
          if (value === true) {
            temp.push(attr);
          } else {
            temp.push(attr + "=" + value);
          }
        }
      }
      return temp.join("; ");
    },
  };
}
