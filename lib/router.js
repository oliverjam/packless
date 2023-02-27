export let router =
  (...routes) =>
  (ctx) => {
    for (let route of routes) {
      let result = route(ctx);
      if (result) return result;
    }
    throw new Error("No matching route found");
  };

let route = (method) => (path, handler) => (ctx) => {
  if (ctx.request.method === method || method === "ALL") {
    if (path instanceof URLPattern && path.test(ctx.request.url)) {
      ctx.params = path.exec(ctx.request.url).pathname.groups;
      return handler(ctx);
    }
    let { pathname } = new URL(ctx.request.url);
    if (path === pathname) {
      return handler(ctx);
    }
  }
};

export let get = route("GET");
export let post = route("POST");
export let all = route("ALL");
export let match = (pathname) => new URLPattern({ pathname });
