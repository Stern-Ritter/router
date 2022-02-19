import Router from "./router";
import { ListenerArgs, RouterType } from "./types";

let router: RouterType;
let origin: typeof console.log;
let homeLink: HTMLLinkElement;
let contactsLink: HTMLLinkElement;
let aboutLink: HTMLLinkElement;
let aboutUsLink: HTMLLinkElement;

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

const handler = (content: string) => async (args: ListenerArgs) => {
  console.log(`${content} args=${JSON.stringify(args)}`);
};

const onLinkClick = (e: Event) => {
  if (e.target instanceof Element && e.target.matches("a")) {
    e.preventDefault();
    const link = e.target as HTMLLinkElement;
    const url = link.getAttribute("href") || "/";
    router.go(url);
  }
}

describe('Function Router', () => {
  beforeEach(() => {
    router = Router();
    origin = console.log;
    console.log = jest.fn();
    document.body.innerHTML = `
    <header>
      <h1>Router</h1>
      <nav style="display: flex; justify-content: space-around;">
        <a class="home" href="/">Home</a>
        <a class="contacts" href="/contacts">Contacts</a>
        <a class="about" href="/about">About</a>
        <a class="about-us" href="/about/us">About / Us</a>
      </nav>
    </header>`;
    homeLink = document.querySelector('.home') as HTMLLinkElement;
    contactsLink = document.querySelector('.contacts') as HTMLLinkElement;
    aboutLink = document.querySelector('.about') as HTMLLinkElement;
    aboutUsLink = document.querySelector('.about-us') as HTMLLinkElement;
    document.body.addEventListener("click", onLinkClick);
  });

  afterEach(() => {
    console.log = origin;
    document.body.removeEventListener("click", onLinkClick);
  });

  it("returns object with on() and go() fuctions", () => {
    expect(router).toHaveProperty('on');
    expect(router).toHaveProperty('go');
    expect(router.on).toBeInstanceOf(Function);
    expect(router.go).toBeInstanceOf(Function);
  });

  it(`supports routes from: RegExp, function, string
  and async hooks onLeave, on Enter, onBeforeEnter and parameters in hooks`, async () => {
    router.on({
      match: /.*/ ,
      onEnter: handler("/.*")
    });
    router.on({
      match: (path) => path === "/contacts",
      onEnter: handler("/contacts"),
      onLeave: handler("[leaving] /contacts"),
    });
    router.on({
      match: "/about",
      onBeforeEnter: handler("[beforeEnter] /about"),
      onEnter: handler("/about")
    });
    router.on({
      match: "/about/us",
      onEnter: handler("/about/us")
    });

    await sleep(100);
    expect(console.log).toHaveBeenNthCalledWith(1, '/.* args={"currentPath":"/","previousPath":"","state":null}');

    homeLink.click();
    await sleep(100);
    expect(console.log).toHaveBeenNthCalledWith(2, '/.* args={"currentPath":"/","previousPath":"/","state":{}}');

    contactsLink.click();
    await sleep(100);
    expect(console.log).toHaveBeenNthCalledWith(3, '/.* args={"currentPath":"/contacts","previousPath":"/","state":{}}');
    expect(console.log).toHaveBeenNthCalledWith(4, '/contacts args={"currentPath":"/contacts","previousPath":"/","state":{}}');

    aboutLink.click();
    await sleep(100);
    expect(console.log).toHaveBeenNthCalledWith(5, '[beforeEnter] /about args={"currentPath":"/contacts","previousPath":"/","state":{"nextPath":"/about"}}');
    expect(console.log).toHaveBeenNthCalledWith(6, '/.* args={"currentPath":"/about","previousPath":"/contacts","state":{}}');
    expect(console.log).toHaveBeenNthCalledWith(7, '[leaving] /contacts args={"currentPath":"/about","previousPath":"/contacts","state":{}}');
    expect(console.log).toHaveBeenNthCalledWith(8, '/about args={"currentPath":"/about","previousPath":"/contacts","state":{}}');

    aboutUsLink.click();
    await sleep(100);
    expect(console.log).toHaveBeenNthCalledWith(9, '/.* args={"currentPath":"/about/us","previousPath":"/about","state":{}}');
    expect(console.log).toHaveBeenNthCalledWith(10, '/about/us args={"currentPath":"/about/us","previousPath":"/about","state":{}}');
  });
});
