export let router =
  (...routes) =>
  (request) => {
    for (let route of routes) {
      let result = route(request);
      if (result) return result;
    }
    throw new Error("No matching route found");
  };

let route = (method) => (path, handler) => (request) => {
  if (request.method === method) {
    if (path instanceof URLPattern && path.test(request.url)) {
      let params = path.exec(request.url).pathname.groups;
      return handler(request, params);
    }
    let { pathname } = new URL(request.url);
    if (path === pathname) {
      return handler(request);
    }
  }
};

export let get = route("GET");
export let post = route("POST");
export let match = (pathname) => new URLPattern({ pathname });
