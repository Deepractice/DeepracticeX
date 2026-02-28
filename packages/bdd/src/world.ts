export interface IWorld {
  readonly attach: ICreateAttachment;
  readonly log: ICreateLog;
  readonly parameters: Record<string, unknown>;
}

export type ICreateAttachment = (
  data: string | Buffer,
  mediaType?: string
) => void;
export type ICreateLog = (text: string) => void;

export interface IWorldOptions {
  attach: ICreateAttachment;
  log: ICreateLog;
  parameters: Record<string, unknown>;
}

export class World implements IWorld {
  readonly attach: ICreateAttachment;
  readonly log: ICreateLog;
  readonly parameters: Record<string, unknown>;

  constructor({ attach, log, parameters }: IWorldOptions) {
    this.attach = attach;
    this.log = log;
    this.parameters = parameters;
  }
}

type WorldConstructor = new (options: IWorldOptions) => IWorld;

let worldConstructor: WorldConstructor = World;

export function setWorldConstructor(constructor: WorldConstructor): void {
  worldConstructor = constructor;
}

export function getWorldConstructor(): WorldConstructor {
  return worldConstructor;
}

export function createWorld(
  parameters: Record<string, unknown> = {}
): IWorld {
  const logs: string[] = [];
  const attachments: Array<{ data: string | Buffer; mediaType?: string }> = [];

  return new (getWorldConstructor())({
    attach: (data, mediaType) => {
      attachments.push({ data, mediaType });
    },
    log: (text) => {
      logs.push(text);
    },
    parameters,
  });
}
