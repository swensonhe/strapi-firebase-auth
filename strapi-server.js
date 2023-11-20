"use strict";

module.exports =
  process.env.NODE_ENV === "local"
    ? require("./dist/server")
    : require("./server");
