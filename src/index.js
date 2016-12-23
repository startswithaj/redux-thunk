function createThunkMiddleware(extraArgument, serviceProviderFn) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    } else if (Array.isArray(action)) {
      const argumentNames = action;
      const actionFn = argumentNames.pop();
      if (typeof actionFn !== 'function') {
        throw new Error('Thunk DI Error: last array element must be action.');
      }
      const args = [];
      for (const argName of argumentNames) {
        if (argName === 'dispatch') {args.push(dispatch); continue;}
        if (argName === 'getState') {args.push(getState); continue;}
        if (serviceProviderFn) {
          const service = serviceProviderFn(argName);
          if (service) {args.push(service); continue;}
        }
        throw new Error('Thunk DI Error: could not get service: ' + argName);
      }
      args.push(extraArgument);
      return actionFn.apply(actionFn, args);
    }

    return next(action);
  };
}


const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
