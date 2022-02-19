import {
  MatchType,
  ListenerType,
  ListenerArgs,
  ListenerFunction,
} from "./types";

function Router() {
  let listeners = [] as ListenerType[];
  let currentPath = window.location.pathname;
  let previousPath = "";

  const generateId = (): number => {
    const existingIds = listeners.map((listener) => listener.id);
    const nextId = existingIds.length === 0 ? 1 : Math.max(...existingIds) + 1;
    return nextId;
  };

  const isMatch = (match: MatchType, path: string): boolean =>
    (typeof match === "string" && match === path) ||
    (match instanceof RegExp && match.test(path)) ||
    (typeof match === "function" && match(path));

  const handleListener = (listener: ListenerType): void => {
    const { match, onEnter, onLeave } = listener;
    const args: ListenerArgs = {
      currentPath,
      previousPath,
      state: window.history.state,
    };

    if(isMatch(match, currentPath)) { onEnter(args) }
    if(isMatch(match, previousPath) && onLeave) { onLeave(args) }
  };

  const handleAllListeners = () => listeners.forEach(handleListener);
  const addEventListeners = () =>
    window.addEventListener("popstate", handleAllListeners);

  const on = (
    match: MatchType,
    onEnter: ListenerFunction,
    onBeforeEnter?: ListenerFunction,
    onLeave?: ListenerFunction
  ): (() => void) => {
    const id = generateId();
    const listener: ListenerType = {
      id,
      match,
      onEnter,
      onBeforeEnter,
      onLeave,
    };
    listeners.push(listener);
    handleListener(listener);

    return () => { listeners = listeners.filter((element) => element.id !== id) };
  };

  const go = (url: string, state?: Record<string, any>) => {
    previousPath = currentPath;
    window.history.pushState(state || {}, document.title, url);
    currentPath = window.location.pathname;
    handleAllListeners();
  };

  addEventListeners();

  return { go, on };
}

export default Router;
