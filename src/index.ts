import Router from "./router";
import { ListenerArgs } from "./types";

const createRender =
  (content: string) =>
  (args: ListenerArgs) => {
    (document.getElementById("root") as HTMLElement).innerHTML = `<h2>${content}</h2>`;
    console.info(`${content} args=${JSON.stringify(args)}`);
  };

const router = Router();
const unsubscribe = router.on(/.*/, createRender("/.*"));
router.on(
  (path) => path === "/contacts",
  createRender("/contacts"), // onEnter
  undefined, // onBeforeEnter
  createRender("[leaving] /contacts") // onLeave
);
router.on("/about", createRender("/about"));
router.on("/about/us", createRender("/about/us"));

document.body.addEventListener("click", (e) => {
  if (e.target instanceof Element && e.target.matches("a")) {
    e.preventDefault();
    const link = e.target as HTMLLinkElement;
    const url = link.getAttribute("href") || '/';
    router.go(url);
    unsubscribe();
  }
});
