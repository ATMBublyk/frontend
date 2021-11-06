const gulp = require("gulp");
const less = require("gulp-less");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const mqpacker = require("css-mqpacker");
const minify = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const del = require("del");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");
const named = require("vinyl-named");

const dist = "./dist/";

gulp.task("copy-html", () => {
    return gulp.src("./src/pages/**/*.html")
        .pipe(gulp.dest(dist + "pages"));

    // .on("end", browsersync.reload);
});

gulp.task("build-styles", () => {
    return gulp.src("./src/assets/less/style.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            mqpacker({
                sort: true
            })
        ]))
        .pipe(gulp.dest("./dist/assets/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("./dist/assets/css"));
    // .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js", {allowEmpty: true})
        .pipe(named())
        .pipe(webpack({
            mode: 'development',
            watch: false,
            devtool: "source-map",
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]
                            ],
                            plugins: [
                                "@babel/plugin-proposal-class-properties"
                            ]
                        }
                    }
                }]
            }
        }))
        .pipe(gulp.dest(dist + 'js'));
    // .on("end", browsersync.reload);
});

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js", {allowEmpty: true})
        .pipe(named)
        .pipe(webpack({
            mode: 'production',
            module: {
                rules: [{
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]
                            ],
                            plugins: [
                               "@babel/plugin-proposal-class-properties"
                            ]
                        }
                    }
                }]
            }
        }))
        .pipe(gulp.dest(dist + 'js'));
});

gulp.task("optimize-images", function () {
    return gulp.src("./dist/assets/img/**/*.{png, jpg, gif}")
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.mozjpeg({
                quality: 75,
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 3,
                progressive: true
            })
        ]))
        .pipe(gulp.dest("./dist/assets/img"));
});

gulp.task("optimize-symbols", function () {
    return gulp.src("./dist/assets/img/icons/*.svg")
        .pipe(svgmin())
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename("symbols.svg"))
        .pipe(gulp.dest("./dist/assets/img/icons"));
});

gulp.task("copy-assets", () => {
    return gulp.src([
        "./src/assets/fonts/**/*.{woff,woff2}",
        "./src/assets/img/**",
    ], {
        base: "./src/assets"
    })
        .pipe(gulp.dest(dist + "/assets"));
    // .on("end", browsersync.reload);
});

gulp.task("clean", function () {
    return del(dist);
});

gulp.task("build", gulp.series(
    "clean",
    "copy-html",
    "copy-assets",
    "build-styles",
    "build-js",
    "optimize-images",
    "optimize-symbols"
));

gulp.task("watch", function () {
    // browsersync.init({
    //   server: "./dist/",
    //   port: 4001,
    //   notify: true
    // });

    gulp.watch("./src/pages/**/*.html", gulp.parallel("copy-html"));
    gulp.watch(["./src/assets/fonts/**/*.{woff,woff2}", "./src/assets/img/**"], () => {
        gulp.series(
            "copy-assets",
            "optimize-images",
            "optimize-symbols",
            // browsersync.reload()
        );
    });
    gulp.watch("./src/assets/less/**/*.less", gulp.parallel("build-styles"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("default", gulp.parallel("watch", "build"));
