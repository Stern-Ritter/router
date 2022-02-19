type MatchFunction = (path: string) => boolean;

type MatchType = MatchFunction | RegExp | string;

type ListenerArgs = {
  currentPath: string,
  previousPath: string,
  state: Record<string, any>
}

type ListenerFunction = (args: ListenerArgs) => Promise<void>;

type ListenerType = {
  id: number;
  match: MatchType;
  onEnter?: ListenerFunction;
  onBeforeEnter?: ListenerFunction;
  onLeave?: ListenerFunction;
};

type RouterType = {
  go: (url: string, state?: Record<string, any>) => void,
  on: (args: Omit<ListenerType, "id">) => (() => void)
}

export { MatchType, ListenerType, ListenerArgs, ListenerFunction, RouterType};
