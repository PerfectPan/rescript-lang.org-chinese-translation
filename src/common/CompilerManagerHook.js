// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Curry from "bs-platform/lib/es6/curry.js";
import * as React from "react";
import * as Belt_Int from "bs-platform/lib/es6/belt_Int.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as Belt_Array from "bs-platform/lib/es6/belt_Array.js";
import * as Caml_array from "bs-platform/lib/es6/caml_array.js";
import * as Belt_Option from "bs-platform/lib/es6/belt_Option.js";
import * as Caml_option from "bs-platform/lib/es6/caml_option.js";
import * as LoadScript from "../ffi/loadScript";
import LoadScript$1 from "../ffi/loadScript";
import * as RescriptCompilerApi from "../bindings/RescriptCompilerApi.js";

function loadScriptPromise(url) {
  return new Promise((function (resolve, _reject) {
                LoadScript$1(url, (function (param) {
                        return resolve({
                                    TAG: 0,
                                    _0: undefined,
                                    [Symbol.for("name")]: "Ok"
                                  });
                      }), (function (_err) {
                        return resolve({
                                    TAG: 1,
                                    _0: "Could not load script: " + url,
                                    [Symbol.for("name")]: "Error"
                                  });
                      }));
                
              }));
}

var versions = [
  "v9.0.1-temp",
  "v9.0.1",
  "v9.0.0",
  "v8.4.2",
  "v8.3.0-dev.2"
];

function getCompilerUrl(version) {
  return "https://cdn.rescript-lang.org/" + version + "/compiler.js";
}

function getLibraryCmijUrl(version, libraryName) {
  return "https://cdn.rescript-lang.org/" + version + "/" + libraryName + "/cmij.js";
}

var FinalResult = {};

function migrateLibraries(version, libraries) {
  var match = Belt_List.fromArray(version.split("."));
  if (!match) {
    return libraries;
  }
  var version$1 = Belt_Option.getWithDefault(Belt_Int.fromString(match.hd.replace("v", "")), 0);
  return Belt_Array.map(libraries, (function (library) {
                if (version$1 >= 9) {
                  if (library === "reason-react") {
                    return "@rescript/react";
                  } else {
                    return library;
                  }
                } else if (library === "@rescript/react") {
                  return "reason-react";
                } else {
                  return library;
                }
              }));
}

function attachCompilerAndLibraries(version, libraries, param) {
  var compilerUrl = getCompilerUrl(version);
  return loadScriptPromise(compilerUrl).then(function (r) {
                  if (r.TAG === /* Ok */0) {
                    return r;
                  } else {
                    return {
                            TAG: 1,
                            _0: "Could not load compiler from url " + compilerUrl,
                            [Symbol.for("name")]: "Error"
                          };
                  }
                }).then(function (r) {
                var tmp;
                tmp = r.TAG === /* Ok */0 ? Belt_Array.map(libraries, (function (lib) {
                          var cmijUrl = getLibraryCmijUrl(version, lib);
                          return loadScriptPromise(cmijUrl).then(function (r) {
                                      if (r.TAG === /* Ok */0) {
                                        return r;
                                      } else {
                                        return {
                                                TAG: 1,
                                                _0: "Could not load cmij from url " + cmijUrl,
                                                [Symbol.for("name")]: "Error"
                                              };
                                      }
                                    });
                        })) : [Promise.resolve({
                          TAG: 1,
                          _0: r._0,
                          [Symbol.for("name")]: "Error"
                        })];
                return Promise.all(tmp);
              }).then(function (all) {
              var errors = Belt_Array.reduce(all, [], (function (acc, r) {
                      if (r.TAG === /* Ok */0) {
                        return acc;
                      } else {
                        return acc.concat([r._0]);
                      }
                    }));
              if (errors.length !== 0) {
                return {
                        TAG: 1,
                        _0: errors,
                        [Symbol.for("name")]: "Error"
                      };
              } else {
                return {
                        TAG: 0,
                        _0: undefined,
                        [Symbol.for("name")]: "Ok"
                      };
              }
            });
}

function useCompilerManager(initialLangOpt, onAction, param) {
  var initialLang = initialLangOpt !== undefined ? initialLangOpt : /* Res */2;
  var match = React.useState(function () {
        return /* Init */0;
      });
  var setState = match[1];
  var state = match[0];
  var dispatch = function (action) {
    Belt_Option.forEach(onAction, (function (cb) {
            return Curry._1(cb, action);
          }));
    switch (action.TAG | 0) {
      case /* SwitchToCompiler */0 :
          var libraries = action.libraries;
          var id = action.id;
          if (typeof state === "number") {
            return ;
          }
          if (state.TAG !== /* Ready */2) {
            return ;
          }
          var ready = state._0;
          if (ready.selected.id !== id) {
            return Curry._1(setState, (function (param) {
                          return {
                                  TAG: 1,
                                  _0: ready,
                                  _1: id,
                                  _2: libraries,
                                  [Symbol.for("name")]: "SwitchingCompiler"
                                };
                        }));
          } else {
            return ;
          }
      case /* SwitchLanguage */1 :
          var code = action.code;
          var lang = action.lang;
          if (typeof state === "number") {
            return ;
          }
          if (state.TAG !== /* Ready */2) {
            return ;
          }
          var ready$1 = state._0;
          var instance = ready$1.selected.instance;
          var availableTargetLangs = RescriptCompilerApi.Version.availableLanguages(ready$1.selected.apiVersion);
          var currentLang = ready$1.targetLang;
          return Belt_Option.forEach(Caml_option.undefined_to_opt(availableTargetLangs.find(function (l) {
                              return l === lang;
                            })), (function (lang) {
                        var match = ready$1.selected.apiVersion;
                        var match$1;
                        if (match) {
                          match$1 = [
                            /* Nothing */0,
                            lang
                          ];
                        } else {
                          var convResult;
                          switch (currentLang) {
                            case /* Reason */0 :
                                convResult = lang >= 2 ? RescriptCompilerApi.Compiler.convertSyntax(/* Reason */0, /* Res */2, code, instance) : undefined;
                                break;
                            case /* OCaml */1 :
                                convResult = undefined;
                                break;
                            case /* Res */2 :
                                convResult = lang !== 0 ? undefined : RescriptCompilerApi.Compiler.convertSyntax(/* Res */2, /* Reason */0, code, instance);
                                break;
                            
                          }
                          if (convResult !== undefined) {
                            if (convResult.TAG === /* Success */0) {
                              match$1 = [
                                {
                                  TAG: 0,
                                  _0: convResult,
                                  [Symbol.for("name")]: "Conv"
                                },
                                lang
                              ];
                            } else {
                              var secondTry = RescriptCompilerApi.Compiler.convertSyntax(lang, lang, code, instance);
                              match$1 = [
                                {
                                  TAG: 0,
                                  _0: secondTry,
                                  [Symbol.for("name")]: "Conv"
                                },
                                lang
                              ];
                            }
                          } else {
                            match$1 = [
                              /* Nothing */0,
                              lang
                            ];
                          }
                        }
                        var targetLang = match$1[1];
                        var result = match$1[0];
                        return Curry._1(setState, (function (param) {
                                      return {
                                              TAG: 2,
                                              _0: {
                                                versions: ready$1.versions,
                                                selected: ready$1.selected,
                                                targetLang: targetLang,
                                                errors: [],
                                                result: result
                                              },
                                              [Symbol.for("name")]: "Ready"
                                            };
                                    }));
                      }));
      case /* Format */2 :
          var code$1 = action._0;
          if (typeof state === "number") {
            return ;
          }
          if (state.TAG !== /* Ready */2) {
            return ;
          }
          var ready$2 = state._0;
          var instance$1 = ready$2.selected.instance;
          var match = ready$2.targetLang;
          var convResult;
          switch (match) {
            case /* Reason */0 :
                convResult = RescriptCompilerApi.Compiler.reasonFormat(instance$1, code$1);
                break;
            case /* OCaml */1 :
                convResult = undefined;
                break;
            case /* Res */2 :
                convResult = RescriptCompilerApi.Compiler.resFormat(instance$1, code$1);
                break;
            
          }
          var result = convResult !== undefined && !(convResult.TAG === /* Success */0 && code$1 === convResult._0.code) ? ({
                TAG: 0,
                _0: convResult,
                [Symbol.for("name")]: "Conv"
              }) : ready$2.result;
          return Curry._1(setState, (function (param) {
                        return {
                                TAG: 2,
                                _0: {
                                  versions: ready$2.versions,
                                  selected: ready$2.selected,
                                  targetLang: ready$2.targetLang,
                                  errors: [],
                                  result: result
                                },
                                [Symbol.for("name")]: "Ready"
                              };
                      }));
      case /* CompileCode */3 :
          var code$2 = action._1;
          var lang$1 = action._0;
          if (typeof state === "number") {
            return ;
          }
          if (state.TAG !== /* Ready */2) {
            return ;
          }
          var ready$3 = state._0;
          return Curry._1(setState, (function (param) {
                        return {
                                TAG: 3,
                                _0: ready$3,
                                _1: [
                                  lang$1,
                                  code$2
                                ],
                                [Symbol.for("name")]: "Compiling"
                              };
                      }));
      case /* UpdateConfig */4 :
          var config = action._0;
          if (typeof state === "number") {
            return ;
          }
          if (state.TAG !== /* Ready */2) {
            return ;
          }
          var ready$4 = state._0;
          RescriptCompilerApi.Compiler.setConfig(ready$4.selected.instance, config);
          return Curry._1(setState, (function (param) {
                        var init = ready$4.selected;
                        var selected_id = init.id;
                        var selected_apiVersion = init.apiVersion;
                        var selected_compilerVersion = init.compilerVersion;
                        var selected_ocamlVersion = init.ocamlVersion;
                        var selected_reasonVersion = init.reasonVersion;
                        var selected_libraries = init.libraries;
                        var selected_instance = init.instance;
                        var selected = {
                          id: selected_id,
                          apiVersion: selected_apiVersion,
                          compilerVersion: selected_compilerVersion,
                          ocamlVersion: selected_ocamlVersion,
                          reasonVersion: selected_reasonVersion,
                          libraries: selected_libraries,
                          config: config,
                          instance: selected_instance
                        };
                        return {
                                TAG: 2,
                                _0: {
                                  versions: ready$4.versions,
                                  selected: selected,
                                  targetLang: ready$4.targetLang,
                                  errors: ready$4.errors,
                                  result: ready$4.result
                                },
                                [Symbol.for("name")]: "Ready"
                              };
                      }));
      
    }
  };
  var dispatchError = function (err) {
    return Curry._1(setState, (function (prev) {
                  var msg = err._0;
                  if (typeof prev === "number") {
                    return {
                            TAG: 0,
                            _0: msg,
                            [Symbol.for("name")]: "SetupFailed"
                          };
                  }
                  if (prev.TAG !== /* Ready */2) {
                    return {
                            TAG: 0,
                            _0: msg,
                            [Symbol.for("name")]: "SetupFailed"
                          };
                  }
                  var ready = prev._0;
                  return {
                          TAG: 2,
                          _0: {
                            versions: ready.versions,
                            selected: ready.selected,
                            targetLang: ready.targetLang,
                            errors: ready.errors.concat([msg]),
                            result: ready.result
                          },
                          [Symbol.for("name")]: "Ready"
                        };
                }));
  };
  React.useEffect((function () {
          if (typeof state === "number") {
            if (versions.length !== 0) {
              var latest = Caml_array.get(versions, 0);
              var libraries = ["@rescript/react"];
              attachCompilerAndLibraries(latest, libraries, undefined).then(function (result) {
                    if (result.TAG === /* Ok */0) {
                      var instance = rescript_compiler.make();
                      var apiVersion = RescriptCompilerApi.Version.fromString(rescript_compiler.api_version);
                      var config = RescriptCompilerApi.Compiler.getConfig(instance);
                      var selected_compilerVersion = RescriptCompilerApi.Compiler.version(instance);
                      var selected_ocamlVersion = RescriptCompilerApi.Compiler.ocamlVersion(instance);
                      var selected_reasonVersion = RescriptCompilerApi.Compiler.reasonVersion(instance);
                      var selected = {
                        id: latest,
                        apiVersion: apiVersion,
                        compilerVersion: selected_compilerVersion,
                        ocamlVersion: selected_ocamlVersion,
                        reasonVersion: selected_reasonVersion,
                        libraries: libraries,
                        config: config,
                        instance: instance
                      };
                      var targetLang = Belt_Option.getWithDefault(Caml_option.undefined_to_opt(RescriptCompilerApi.Version.availableLanguages(apiVersion).find(function (l) {
                                    return l === initialLang;
                                  })), RescriptCompilerApi.Version.defaultTargetLang(apiVersion));
                      return Curry._1(setState, (function (param) {
                                    return {
                                            TAG: 2,
                                            _0: {
                                              versions: versions,
                                              selected: selected,
                                              targetLang: targetLang,
                                              errors: [],
                                              result: /* Nothing */0
                                            },
                                            [Symbol.for("name")]: "Ready"
                                          };
                                  }));
                    }
                    var msg = result._0.join("; ");
                    return dispatchError({
                                TAG: 1,
                                _0: msg,
                                [Symbol.for("name")]: "CompilerLoadingError"
                              });
                  });
            } else {
              dispatchError({
                    TAG: 0,
                    _0: "No compiler versions found",
                    [Symbol.for("name")]: "SetupError"
                  });
            }
          } else {
            switch (state.TAG | 0) {
              case /* SwitchingCompiler */1 :
                  var version = state._1;
                  var ready = state._0;
                  var migratedLibraries = migrateLibraries(version, state._2);
                  attachCompilerAndLibraries(version, migratedLibraries, undefined).then(function (result) {
                        if (result.TAG === /* Ok */0) {
                          var prim = getCompilerUrl(ready.selected.id);
                          LoadScript.removeScript(prim);
                          Belt_Array.forEach(ready.selected.libraries, (function (lib) {
                                  var prim = getLibraryCmijUrl(ready.selected.id, lib);
                                  LoadScript.removeScript(prim);
                                  
                                }));
                          var instance = rescript_compiler.make();
                          var apiVersion = RescriptCompilerApi.Version.fromString(rescript_compiler.api_version);
                          var config = RescriptCompilerApi.Compiler.getConfig(instance);
                          var selected_compilerVersion = RescriptCompilerApi.Compiler.version(instance);
                          var selected_ocamlVersion = RescriptCompilerApi.Compiler.ocamlVersion(instance);
                          var selected_reasonVersion = RescriptCompilerApi.Compiler.reasonVersion(instance);
                          var selected = {
                            id: version,
                            apiVersion: apiVersion,
                            compilerVersion: selected_compilerVersion,
                            ocamlVersion: selected_ocamlVersion,
                            reasonVersion: selected_reasonVersion,
                            libraries: migratedLibraries,
                            config: config,
                            instance: instance
                          };
                          return Curry._1(setState, (function (param) {
                                        return {
                                                TAG: 2,
                                                _0: {
                                                  versions: ready.versions,
                                                  selected: selected,
                                                  targetLang: RescriptCompilerApi.Version.defaultTargetLang(apiVersion),
                                                  errors: [],
                                                  result: /* Nothing */0
                                                },
                                                [Symbol.for("name")]: "Ready"
                                              };
                                      }));
                        }
                        var msg = result._0.join("; ");
                        return dispatchError({
                                    TAG: 1,
                                    _0: msg,
                                    [Symbol.for("name")]: "CompilerLoadingError"
                                  });
                      });
                  break;
              case /* SetupFailed */0 :
              case /* Ready */2 :
                  break;
              case /* Compiling */3 :
                  var match = state._1;
                  var code = match[1];
                  var ready$1 = state._0;
                  var apiVersion = ready$1.selected.apiVersion;
                  var instance = ready$1.selected.instance;
                  var compResult;
                  if (apiVersion) {
                    compResult = {
                      TAG: 2,
                      _0: "Can\'t handle result of compiler API version \"" + apiVersion._0 + "\"",
                      [Symbol.for("name")]: "UnexpectedError"
                    };
                  } else {
                    switch (match[0]) {
                      case /* Reason */0 :
                          compResult = RescriptCompilerApi.Compiler.reasonCompile(instance, code);
                          break;
                      case /* OCaml */1 :
                          compResult = RescriptCompilerApi.Compiler.ocamlCompile(instance, code);
                          break;
                      case /* Res */2 :
                          compResult = RescriptCompilerApi.Compiler.resCompile(instance, code);
                          break;
                      
                    }
                  }
                  Curry._1(setState, (function (param) {
                          return {
                                  TAG: 2,
                                  _0: {
                                    versions: ready$1.versions,
                                    selected: ready$1.selected,
                                    targetLang: ready$1.targetLang,
                                    errors: ready$1.errors,
                                    result: {
                                      TAG: 1,
                                      _0: compResult,
                                      [Symbol.for("name")]: "Comp"
                                    }
                                  },
                                  [Symbol.for("name")]: "Ready"
                                };
                        }));
                  break;
              
            }
          }
          
        }), [state]);
  return [
          state,
          dispatch
        ];
}

export {
  FinalResult ,
  useCompilerManager ,
  
}
/* react Not a pure module */
