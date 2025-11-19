type ValueOf<Obj> = Obj[keyof Obj];

// This is the only changed type
type OneOnly<Obj, Key extends keyof Obj> = Partial<Record<Exclude<keyof Obj, Key>, undefined>> & Pick<Obj, Key>;

type OneOfByKey<Obj> = { [key in keyof Obj]: OneOnly<Obj, key> };

export type OneOf<Obj> = ValueOf<OneOfByKey<Obj>>;
