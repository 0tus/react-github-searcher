(function(global) {

  function debounce(cb, time, ctxt) {
    ctxt = ctxt || null;

    var timeout;

    function debouncedCallback() {
      var args = arguments;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(function() {
        timeout = null;
        cb.apply(ctxt, arguments);
      }, time);
    }

    debouncedCallback.abort = function() {
      clearTimeout(timeout);
      timeout = null;
    }

    return debouncedCallback;
  }

  global.debounce = debounce;

})(this);
