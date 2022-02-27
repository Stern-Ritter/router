import {
  MatchType,
  ListenerType,
  ListenerArgs,
} from "./types";

function Router() {
  const BEFORE = "BEFORE";
  const AFTER = "AFTER";
  let listeners: ListenerType[] = [];
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

  const handleListener = async (type: string[], listener: ListenerType): Promise<void> => {
    const { match, onEnter, onBeforeEnter, onLeave } = listener;
    const nextPath = window.history.state?.nextPath || '';
    const args: ListenerArgs = {
      currentPath,
      previousPath,
      state: window.history.state,
    };
    if (type.includes(BEFORE)) {
      if (isMatch(match, nextPath) && onBeforeEnter) {
        await onBeforeEnter(args);
      }
    }
    if (type.includes(AFTER)) {
      if (isMatch(match, previousPath) && onLeave) {
        await onLeave(args);
      }
      if (isMatch(match, currentPath) && onEnter) {
        await onEnter(args);
      }
    }
  };

  const handleAllListeners = async(type: string[]) => {
    Promise.all(listeners.map((listener) => handleListener(type, listener)));
  };

  const addEventListeners = () => {
    window.addEventListener("popstate", () =>
      handleAllListeners([BEFORE, AFTER])
    );
  }

  const on = (args: Omit<ListenerType, "id">): (() => void) => {
    const id = generateId();
    const listener: ListenerType = { ...args, id};
    listeners.push(listener);
    handleListener([BEFORE, AFTER], listener);

    return () => { listeners = listeners.filter((element) => element.id !== id) };
  };

  const go = (url: string, state?: Record<string, any>) => {
    window.history.replaceState(
      { ...state, nextPath: url},
      document.title,
      window.location.pathname
    );
    handleAllListeners([BEFORE]);
    previousPath = currentPath;
    window.history.pushState(
      state || {},
      document.title,
      url);
    currentPath = window.location.pathname;
    handleAllListeners([AFTER]);
  };

  addEventListeners();

  return { go, on };
}

export default Router;
