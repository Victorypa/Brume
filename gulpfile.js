"use strict";

// Переменные для галпа. Каждая переменная – отдельный плагин из package.json
var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var server = require("browser-sync").create();
var uglify = require("gulp-uglify");
var babel = require('gulp-babel');
var concat = require("gulp-concat");
var srcmaps = require('gulp-sourcemaps');

// Таск css.
gulp.task("css", function () {
  return gulp.src("src/sass/style.scss") // Берет на вход основной файл scss, где происходят импорты
    .pipe(srcmaps.init()) // Иницициализируем плагин для генерации src map.
      .pipe(plumber()) // Плагин для отслеживания ошибок
      .pipe(sass()) // Переводим из sass в css
      .pipe(postcss([ // Применяем пост процессор PostCSS. Расставляем префиксы для других браузеров.
        autoprefixer()
      ]))
      .pipe(gulp.dest("build/css")) // Скадываем полученный css в папку build
      .pipe(csso()) // Минифицируем css. Убираем лишние пробелы и т.д.
      .pipe(rename("style.min.css")) // Переименовываем минифицированную версию в style.min.css
    .pipe(srcmaps.write()) // Добавляем src map
    .pipe(gulp.dest("build/css")) //  В итоге 2 файла: style.css и style.min.css
    .pipe(server.stream()); // Вызываем отслеживание browser sync
});

// Таск для картинок
gulp.task("images", function () {
  return gulp.src("src/img/**/*.{png,jpg,svg}") // Берем все картинки из src/img
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}), // Применяем сжатие картинок
      imagemin.jpegtran({progressive: true}), // JPEG делаем прогрессивными, т.е. они теперь загружаются постепенно и видны сразу
      imagemin.svgo() // Минифицируем svg
    ]))
    .pipe(gulp.dest("src/img")); // Складываем в папку
});

// Таск для генерации webp
gulp.task("webp", function () {
  return gulp.src("src/img/**/*.{png,jpg}") // Берем все jpeg и png из src/img
    .pipe(webp({quality: 90})) // Выставляем качество 90, чтобы не было артефактов
    .pipe(gulp.dest("build/img")) // Складываем в папку
});

// Таск для генерации svg спрайта
gulp.task("sprite", function () {
  return gulp.src("src/img/**/*.svg") // Берем все svg из src/img
    .pipe(svgstore({
      inlineSvg: true // Делаем спрайт вида <svg><symbol>....</symbol></svg>
    }))
    .pipe(rename("sprite.svg")) // Переименовываем в sprite.svg
    .pipe(gulp.dest("build/img")); // Складываем в папку build/img
});

// Таск для встраивания спрайта в  html
gulp.task("html", function () {
  return gulp.src("src/*.html") // Берем все странички
    .pipe(posthtml([
      include() // Вставляем svg спрайт в страничку
    ]))
    .pipe(gulp.dest("build")); // Складываем в build/
});

// Таск для сбора скриптов
gulp.task("scripts", function() {
  return gulp.src("src/js/*.js") // Берем все скрипты из src/js
    .pipe(srcmaps.init())
      .pipe(concat("script.js")) // Склеиваем их в один scripts.js
      .pipe(gulp.dest("build/js")) // Складываем build/js
      .pipe(rename("script.min.js")) // Переименовываем в scripts.min.js
      .pipe(babel({
        presets: ['@babel/env'] // Прогоняем через babel. Переводит ES6+ в ES5
      }))
      .pipe(uglify()) // Минифицируем
    .pipe(srcmaps.write())
    .pipe(gulp.dest("build/js")); //Скидываем в build/js
});

/*
gulp.task('mediabox-js', function () {
  return gulp.src('/node_modules/mediabox/dist/mediabox.min.js
              .pipe(gulp.dest('build/js'));
});

gulp.task('mediabox-css', function () {
  return gulp.src('/node_modules/mediabox/dist/mediabox.css
              .pipe(gulp.dest('build/css'));
});
*/

// Таск для очистки папки
gulp.task("clean", function () {
  return del("build"); // Удаляем папку build
});

// Таск для переноса всех статичных файлов
gulp.task("copy", function () {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}", // Переносим шрифты
    "src/img/**", // Переносим картинки
    "src/js/**", // Переносим js
    "src/*.{png,xml,ico,webmanifest,svg}" // Переносим фавиконки
  ], {
    base: "src"
  })
  .pipe(gulp.dest("build")); // Складываем в build/
});

// Таск для сборки
gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "scripts",
  "sprite",
  "webp",
  "html"
  ));

// Таск для отслеживания изменений. Browser Sync
gulp.task("server", function () {
  server.init({ // Инициализурем с конфигом
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
  // Смотрит за файлами и перезагружает, если есть изменение
  gulp.watch("src/sass/**/*.scss", gulp.series("css", "refresh"));
  gulp.watch("src/img/**/*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("src/*.html", gulp.series("html", "refresh"));
  gulp.watch("src/js/*.js", gulp.series("scripts", "refresh"));
});

// Перезагрузка отслеживания
gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("start", gulp.series("build", "server"));
