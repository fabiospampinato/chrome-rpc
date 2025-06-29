
/* HELPERS */

type FN = ( ...args: any[] ) => any;

/* MAIN */

type BackendOptions<T extends Procedures> = {
  channel?: string,
  procedures: T
};

type FrontendOptions = {
  channel?: string
};

type Procedures = Record<string, FN>;

type ProceduresNames<T extends Procedures> = keyof T extends string ? keyof T : never;

type ProceduresProxied<T extends Procedures> = { [K in Exclude<keyof T, 'then'>]: (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>> };

type ProcedureFunction<T extends Procedures, U extends ProceduresNames<T>> = T[U];

type ProcedureArguments<T extends Procedures, U extends ProceduresNames<T>> = Parameters<ProcedureFunction<T, U>>;

type ProcedureReturn<T extends Procedures, U extends ProceduresNames<T>> = ReturnType<ProcedureFunction<T, U>>;

type ProcedureProxied<T extends FN> = (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;

/* EXPORt */

export type {BackendOptions, FrontendOptions};
export type {Procedures, ProceduresNames, ProceduresProxied, ProcedureFunction, ProcedureArguments, ProcedureReturn, ProcedureProxied};
