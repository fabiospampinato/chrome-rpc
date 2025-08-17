
/* IMPORT */

import type {FrontendOptions} from './types';
import type {Procedures, ProceduresNames, ProceduresProxied, ProcedureFunction, ProcedureArguments, ProcedureReturn, ProcedureProxied} from './types';

/* MAIN */

const frontend = <T extends Procedures> ( options?: FrontendOptions ): ProceduresProxied<T> => {

  const channel = options?.channel ?? 'default';

  return new Proxy ( {} as ProceduresProxied<T>, {

    get: <U extends ProceduresNames<T>> ( _: unknown, procedure: U ): ProcedureProxied<ProcedureFunction<T, U>> => {

      return async ( ...args: ProcedureArguments<T, U> ): Promise<Awaited<ProcedureReturn<T, U>>> => {

        const request = { type: procedure, args, chrome_rpc_channel: channel };
        const response = await chrome.runtime.sendMessage ( request );

        if ( 'error' in response ) {

          throw new Error ( response.error );

        } else {

          return response.value;

        }

      };

    }

  });

};

/* EXPORT */

export default frontend;
export type {FrontendOptions};
