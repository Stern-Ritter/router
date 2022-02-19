type MatchFunction = (path: string) => boolean;

type MatchType = MatchFunction | RegExp | string;

type ListenerArgs = {
  currentPath: string,
  previousPath: string,
  state: Record<string, any>
}

type ListenerFunction = (args: ListenerArgs) => void;

type ListenerType = {
  id: number;
  match: MatchType;
  onEnter: ListenerFunction;
  onBeforeEnter?: ListenerFunction;
  onLeave?: ListenerFunction;
};

export { MatchType, ListenerType, ListenerArgs, ListenerFunction };
