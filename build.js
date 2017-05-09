var fs = require("fs");
var browserify = require("browserify");
browserify(["./src/main.js"], { "debug": "true" })
    .transform("babelify", { presets: ["es2015", "react"] })
    .bundle()
    .pipe(fs.createWriteStream("./lib/cyoa.js"));