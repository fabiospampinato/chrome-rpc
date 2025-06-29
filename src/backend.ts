
/* IMPORT */

import type {BackendOptions} from './types';
import type {Procedures} from './types';

/* MAIN */

const backend = <T extends Procedures> ( options: BackendOptions<T> ): void => {

  const channel = options.channel ?? 'default';
  const procedures = options.procedures;

  chrome.runtime.onMessage.addListener ( ( message, sender, sendResponse ) => {

    const {type, args, chrome_rpc_channel} = message;
    const procedure = procedures[type];

    if ( channel !== chrome_rpc_channel ) return; // Ignore messages not for this channel

    if ( procedure ) {

      (async () => { // Nonsense needed to avoid the port being closed before the procedure resolves
        try {

          const value = await procedure ( ...args );
          sendResponse ({ value });

        } catch ( err: unknown ) {

          const error = new Error ( `Failed to call method "${type}":\n\n${String ( err )}` );
          sendResponse ({ error });

        }
      })();

      return true;

    } else {

      const error = new Error ( `Method "${type}" not found` );
      sendResponse ({ error });

    }

  });

};

/* EXPORT */

export default backend;
export type {BackendOptions};
