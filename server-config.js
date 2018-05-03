/**
 * Created by AntonioGiordano on 27/05/16.
 */

'use strict'

module.exports.port = (env) => {
  switch (env) {
    case 'LOCALE':
      return 7777
      case 'PRODUCTIONf':
          return 7777
  }
}
