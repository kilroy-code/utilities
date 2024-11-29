const safeGlobal = (typeof(window) === 'undefined') ? global : window;
export class ki1r0yError extends Error {
  // A ki1r0yError is an error that can occur on machine (e.g., a server) and be communicated to another machine
  // (e.g., a browser), such that the second machine can locally throw the same error.
  // We do that by allowing the creation of safe POJOs that can appear as JSON with all the necessary information,
  // but without sensitive information such as stacks or passwords.
  constructor(message, properties = {}) {
    super(message);
    Object.assign(this, {name: this.constructor.name}, properties);
  }
  get pojo() {
    return ki1r0yError.pojo(this);
  }
  static pojo(error) { // Answer an object with properties of the Error, suitable for Response.send.
    // 'message' is a property of node Error, but not an enumerated.
    // Here we return a Plain Old Javascript Object with message and all the other properties -- except for 'stack'.
    let {name, message, stack, ...properties} = error;
    return {name, message, ...properties};
  }
  static rethrow(errorData, errors, defaultMessage, defaultStatus) {
    // Given an object with Error properties like the result of pojo(error), create an Error and throw it.
    let {
      name = 'RestError',
      message = defaultMessage,
      status = defaultStatus,
      ...properties
    } = errorData,
        errorClass = errors[name] || safeGlobal[name] || Error,
        errorObject = new errorClass(message, {status, name, ...properties});
    throw errorObject;
  }
}

export class CommunicationsError extends ki1r0yError { } // Please include 'status' code in properties.
export class RestError extends CommunicationsError { // method and path can be supplied directly, or pulled from req if supplied.
  constructor(message, {
    req = {},
    method = req.method,
    path = req.originalUrl, // express quirk: originalUrl is a path, not a full url.
    ...properties} = {}) {
    super(message, {method, path, ...properties}); // req is NOT passed on to super.
  }
}
export class ServerError extends RestError { } // 500 series status codes
export class ClientError extends RestError { } // 400 series status codes

export class TaggedError extends ClientError {
  constructor(message, {tag, ...properties}) {
    super(message, {tag, ...properties});
  }
}
export class ForbiddenError extends TaggedError {
  constructor(message, {...properties}) {
    super(message, {status: 403, ...properties});
  }
}

// Default export is an object with all the error names as keys, so that clients can look
// up class object by name.
export default { ki1r0yError, CommunicationsError, RestError, ServerError, ClientError, TaggedError, ForbiddenError };
