import Router from "./router";
import { ListenerArgs } from "./types";

const createRender = (content: string) => async (args: ListenerArgs) => {
  (document.getElementById("root") as HTMLElement).innerHTML = `<h2>${content}</h2>`;
  console.info(`${content} args=${JSON.stringify(args)}`);
};

const router = Router();
const unsubscribe = router.on({ match: /.*/, onEnter: createRender("/.*") });
router.on({
  match: (path) => path === "/contacts",
  onEnter: createRender("/contacts"),
  onLeave: createRender("[leaving] /contacts"),
});
router.on({
  match: "/about",
  onBeforeEnter: createRender("[beforeEnter] /about"),
  onEnter: createRender("/about"),
});
router.on({ match: "/about/us", onEnter: createRender("/about/us") });

document.body.addEventListener("click", (e) => {
  if (e.target instanceof Element && e.target.matches("a")) {
    e.preventDefault();
    const link = e.target as HTMLLinkElement;
    const url = link.getAttribute("href") || "/";
    router.go(url);
  }
});
