(function () {
  const ULTRON = {
    modules: {},
    utils: {},
  };

  const GLOBAL = {
    context: {
      TRACKIER: 'trackier',
      APPSFLYER: 'appsflyer',
      ANDROID: 'Android',
      IOS: 'iOS',
    },
  };

  /**
   * Init Ultron
   *
   * @return an object that looks like this: { addModule }
   * @customfunction
   */
  return new (function initUltron() {
    const bootstrap = () => {
      console.log('Running Ultron version', '@ULTRON_VERSION');

      /**
       *
       * @param {object} An Object with title, description, or suffix for the title.
       * @return void.
       * @customfunction
       */
      function _showFeedback(moduleName) {
        return function ({ title, description, suffix, fail, toast }) {
          const moduleNameWithSuffix =
            moduleName + (suffix ? ' - ' + suffix : '');

          const contextTitle =
            (title || moduleNameWithSuffix) +
            ' | ' +
            (!fail ? 'Sucesso' : 'Falhou');

          if (toast) {
            SpreadsheetApp.getActiveSpreadsheet().toast(
              description,
              contextTitle + '\n',
              15
            );
          } else {
            SpreadsheetApp.getUi().alert(
              contextTitle,
              description,
              SpreadsheetApp.getUi().ButtonSet.OK
            );
          }
        };
      }

      /**
       *
       * @param {object} queryString An object to convert in queyrString.
       * @return a string
       * @customfunction
       */
      function _handleQueryString(qs) {
        if (typeof qs !== 'object') return '';

        return (
          '?' +
          Object.keys(qs)
            .reduce(function (acc, curr) {
              if (qs[curr] === undefined) return acc;

              return acc.concat(
                encodeURIComponent(curr) + '=' + encodeURIComponent(qs[curr])
              );
            }, [])
            .join('&')
        );
      }

      /**
       * Simple function to replace :param by value in URI
       *
       * @param {string} path The URI to add the values. Ex: /sheets/traffic-source-instance/campaign/:id
       * @param {object} params The Object with the values. EX: {id: 17}
       * @return string with the values. EX: /sheets/traffic-source-instance/campaign/17
       * @customfunction
       */
      function _replaceParamsByValues(path, params) {
        const p =
          typeof params === 'object' && !Array.isArray(params) ? params : {};
        const pKeys = Object.keys(p);
        var _replaceParamsByValues_output = path;

        pKeys.forEach(function (pKey) {
          _replaceParamsByValues_output = _replaceParamsByValues_output.replace(
            ':' + pKey,
            p[pKey]
          );
        });

        return _replaceParamsByValues_output;
      }

      /**
       * Requester
       *
       * @param {url_base} url_base The path base to request.
       * @param {headers} headers The headers object
       * @return {Requester}
       * @customfunction
       */
      function _requester(url_base, headers) {
        return {
          /**
           * Simple request to EP
           *
           * @param {string} path The URI to request data. Ex: /sheets/traffic-source-instance/campaign/:id
           * @param {object} params The Object with the values. EX: {id: 17}
           * @param {object} queryString An object to convert in queyrString.
           * @return the payload in JSON.
           * @customfunction
           */
          get: function (path, params, queryString) {
            if (typeof path !== 'string') return undefined;

            const request =
              url_base +
              _replaceParamsByValues(path, params) +
              _handleQueryString(queryString);
            console.log('requesting: ' + request);

            const resp = UrlFetchApp.fetch(request, {
              contentType: 'application/json',
              muteHttpExceptions: true,
              headers: headers,
            });

            if (resp.getResponseCode() === 200) {
              return JSON.parse(resp.getContentText());
            } else {
              _showFeedback('System')({
                fail: true,
                description:
                  'Erro na request: ' +
                  request +
                  '\n\nCode: ' +
                  resp.getResponseCode() +
                  '\nResponse: ' +
                  resp.getContentText(),
              });
              return undefined;
            }
          },
        };
      }

      /**
       * Add new module on Ultron
       *
       * @param {string} name The name of module.
       * @param {object} moduleRef A object with the following structure: {url_base: string, headers?: object | undefined}
       * @return if successful returns a Ultron reference with the new module, otherwise false.
       * @customfunction
       */
      const _addModule = (name, moduleRef) => {
        if (
          typeof name !== 'string' ||
          !moduleRef ||
          typeof moduleRef.url_base !== 'string'
        )
          return false;
        if (
          moduleRef &&
          moduleRef.headers !== undefined &&
          typeof moduleRef.headers !== 'object'
        )
          return false;
        if (ULTRON.modules[name]) {
          console.log(name + ' already exists in the ULTRON instance.');
          return false;
        }

        ULTRON.modules[name] = function () {
          const _nameFormatted = name
            .toLowerCase()
            .split(' ')
            .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
            .join(' ');

          return {
            request: _requester(moduleRef.url_base, moduleRef.headers),
            showFeedback: _showFeedback(_nameFormatted),
          };
        };

        return ULTRON.modules[name];
      };

      /**
       * Add new util on Ultron
       *
       * @param {string} name The name of module.
       * @param {object} utilRef A object with the structure of the utils
       * @return if successful returns a Ultron reference with the new util, otherwise false.
       * @customfunction
       */
      const _addUtils = (name, utilRef) => {
        if (
          typeof name !== 'string' ||
          typeof utilRef !== 'object' ||
          Array.isArray(utilRef)
        )
          return false;

        if (ULTRON.utils[name]) {
          console.log(name + ' already exists in the ULTRON instance.');
          return false;
        }

        ULTRON.utils[name] = function () {
          return utilRef;
        };

        return ULTRON.utils[name];
      };

      const ultronCTX = {
        GLOBAL,
        addModule: _addModule,
        addUtils: _addUtils,
        getUtil: (name) => ULTRON.utils[name],
        getModule: (name) => ULTRON.modules[name],
      };

      return {
        ...ultronCTX,
        dispatches: {
          updateTSIJarvis: () => updateTSIJarvis.call(ultronCTX),
          updateTrackierConversions: () =>
            updateConversions.call(
              ultronCTX,
              ultronCTX.GLOBAL.context.TRACKIER
            ),
          updateAppsflyerConversions: () =>
            updateConversions.call(
              ultronCTX,
              ultronCTX.GLOBAL.context.APPSFLYER
            ),
          updateNFeJarvis: () => updateNFeJarvis.call(ultronCTX),
          updateCurrenciesJarvis: () => updateCurrenciesJarvis.call(ultronCTX),
          updatecostUA_RTGJarvis: () => updatecostUA_RTGJarvis.call(ultronCTX),
          updatecostCostMPJarvis: () => updatecostCostMPJarvis.call(ultronCTX),
        },
      };
    };

    const ref = bootstrap();

    //Initial_modules
    ref.addModule('jarvis', {
      //url_base: 'https://jarvis-gateway.rankmyapp.com/jarvis',
      url_base: 'https://jarvis-api-gateway.apps.dev.rankmycluster.com/jarvis',
      headers: {
        Authorization: '<token>',
      },
    });

    ref.addModule('media', {
      url_base: 'https://jarvis-gateway.rankmyapp.com/provider',
      headers: {
        Authorization: '<token>',
      },
    });

    initUltronUtils.call(ref);

    return ref;
  })();
})();
