globalThis.monorepoPackagePath = "";globalThis.openNextDebug = false;globalThis.openNextVersion = "4.0.2";globalThis.nextVersion = "16.2.10";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod3) => function __require2() {
  return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod3, secondTarget) => (__copyProps(target, mod3, "default"), secondTarget && __copyProps(secondTarget, mod3, "default"));
var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target,
  mod3
));
var __toCommonJS = (mod3) => __copyProps(__defProp({}, "__esModule", { value: true }), mod3);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var IgnorableError;
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
    IgnorableError = class extends Error {
      __openNextInternal = true;
      canIgnore = true;
      logLevel = 0;
      constructor(message) {
        super(message);
        this.name = "IgnorableError";
      }
    };
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var parseHeaders, convertHeader;
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
    parseHeaders = (headers) => {
      const result = {};
      if (!headers) {
        return result;
      }
      for (const [key, value] of Object.entries(headers)) {
        if (value === void 0) {
          continue;
        }
        const keyLower = key.toLowerCase();
        if (keyLower === "location" && Array.isArray(value)) {
          if (value.length === 1 || value[0] === value[1]) {
            result[keyLower] = value[0];
          } else {
            warn("Multiple different values for Location header found. Using the last one");
            result[keyLower] = value[value.length - 1];
          }
          continue;
        }
        result[keyLower] = convertHeader(value);
      }
      return result;
    };
    convertHeader = (header) => {
      if (typeof header === "string") {
        return header;
      }
      if (Array.isArray(header)) {
        return header.join(",");
      }
      return String(header);
    };
  }
});

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
var config_exports = {};
__export(config_exports, {
  AppPathRoutesManifest: () => AppPathRoutesManifest,
  AppPathsManifest: () => AppPathsManifest,
  AppPathsManifestKeys: () => AppPathsManifestKeys,
  BuildId: () => BuildId,
  ConfigHeaders: () => ConfigHeaders,
  FunctionsConfigManifest: () => FunctionsConfigManifest,
  HtmlPages: () => HtmlPages,
  MiddlewareManifest: () => MiddlewareManifest,
  NEXT_DIR: () => NEXT_DIR,
  NextConfig: () => NextConfig,
  OPEN_NEXT_DIR: () => OPEN_NEXT_DIR,
  PagesManifest: () => PagesManifest,
  PrerenderManifest: () => PrerenderManifest,
  RoutesManifest: () => RoutesManifest
});
import path from "node:path";
var NEXT_DIR, OPEN_NEXT_DIR, NextConfig, BuildId, HtmlPages, RoutesManifest, ConfigHeaders, PrerenderManifest, AppPathsManifestKeys, MiddlewareManifest, AppPathsManifest, AppPathRoutesManifest, FunctionsConfigManifest, PagesManifest;
var init_config = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/config/index.js"() {
    init_logger();
    globalThis.__dirname ??= "";
    NEXT_DIR = path.join(__dirname, ".next");
    OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
    debug({ NEXT_DIR, OPEN_NEXT_DIR });
    NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.mjs", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [{ "protocol": "https", "hostname": "*.supabase.co" }], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/Users/jatin/Developer/Real-Estate-AI-Calling-Agent-SaaS-Starter-File", "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": false, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "partialFallbacks": false, "dynamicOnHover": false, "varyParams": false, "prefetchInlining": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 7, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "viewTransition": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": false, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.mjs", "turbopack": { "root": "/Users/jatin/Developer/Real-Estate-AI-Calling-Agent-SaaS-Starter-File" }, "distDirRoot": ".next", "_originalRewrites": { "beforeFiles": [], "afterFiles": [{ "source": "/widget.js", "destination": "/api/widget-script" }], "fallback": [] } };
    BuildId = "iMPw1TiqUTPcKVSJf4zRU";
    HtmlPages = ["/404", "/500"];
    RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [{ "source": "/widget.js", "destination": "/api/widget-script", "regex": "^/widget\\.js(?:/)?$" }], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/api/auth/login", "regex": "^/api/auth/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/login(?:/)?$" }, { "page": "/api/auth/logout", "regex": "^/api/auth/logout(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/logout(?:/)?$" }, { "page": "/api/auth/signup", "regex": "^/api/auth/signup(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/signup(?:/)?$" }, { "page": "/api/checkout", "regex": "^/api/checkout(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/checkout(?:/)?$" }, { "page": "/api/checkout/razorpay", "regex": "^/api/checkout/razorpay(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/checkout/razorpay(?:/)?$" }, { "page": "/api/checkout/razorpay/verify", "regex": "^/api/checkout/razorpay/verify(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/checkout/razorpay/verify(?:/)?$" }, { "page": "/api/dashboard/agents", "regex": "^/api/dashboard/agents(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/dashboard/agents(?:/)?$" }, { "page": "/api/dashboard/appointments", "regex": "^/api/dashboard/appointments(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/dashboard/appointments(?:/)?$" }, { "page": "/api/dashboard/conversations", "regex": "^/api/dashboard/conversations(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/dashboard/conversations(?:/)?$" }, { "page": "/api/dashboard/data", "regex": "^/api/dashboard/data(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/dashboard/data(?:/)?$" }, { "page": "/api/dashboard/properties", "regex": "^/api/dashboard/properties(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/dashboard/properties(?:/)?$" }, { "page": "/api/dashboard/settings", "regex": "^/api/dashboard/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/dashboard/settings(?:/)?$" }, { "page": "/api/dashboard/support", "regex": "^/api/dashboard/support(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/dashboard/support(?:/)?$" }, { "page": "/api/search", "regex": "^/api/search(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/search(?:/)?$" }, { "page": "/api/sites/details", "regex": "^/api/sites/details(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/sites/details(?:/)?$" }, { "page": "/api/sites/portal", "regex": "^/api/sites/portal(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/sites/portal(?:/)?$" }, { "page": "/api/sites/support", "regex": "^/api/sites/support(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/sites/support(?:/)?$" }, { "page": "/api/upload", "regex": "^/api/upload(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/upload(?:/)?$" }, { "page": "/api/voice/book", "regex": "^/api/voice/book(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/voice/book(?:/)?$" }, { "page": "/api/voice/session", "regex": "^/api/voice/session(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/voice/session(?:/)?$" }, { "page": "/api/webhook", "regex": "^/api/webhook(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/webhook(?:/)?$" }, { "page": "/api/widget", "regex": "^/api/widget(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/widget(?:/)?$" }, { "page": "/api/widget/details", "regex": "^/api/widget/details(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/widget/details(?:/)?$" }, { "page": "/dashboard", "regex": "^/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard(?:/)?$" }, { "page": "/dashboard/agents", "regex": "^/dashboard/agents(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/agents(?:/)?$" }, { "page": "/dashboard/appointments", "regex": "^/dashboard/appointments(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/appointments(?:/)?$" }, { "page": "/dashboard/clients", "regex": "^/dashboard/clients(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/clients(?:/)?$" }, { "page": "/dashboard/conversations", "regex": "^/dashboard/conversations(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/conversations(?:/)?$" }, { "page": "/dashboard/notifications", "regex": "^/dashboard/notifications(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/notifications(?:/)?$" }, { "page": "/dashboard/plans", "regex": "^/dashboard/plans(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/plans(?:/)?$" }, { "page": "/dashboard/properties", "regex": "^/dashboard/properties(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/properties(?:/)?$" }, { "page": "/dashboard/schedule", "regex": "^/dashboard/schedule(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/schedule(?:/)?$" }, { "page": "/dashboard/services", "regex": "^/dashboard/services(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/services(?:/)?$" }, { "page": "/dashboard/settings", "regex": "^/dashboard/settings(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/settings(?:/)?$" }, { "page": "/dashboard/support", "regex": "^/dashboard/support(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/support(?:/)?$" }, { "page": "/dashboard/website-builder", "regex": "^/dashboard/website\\-builder(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/website\\-builder(?:/)?$" }, { "page": "/dashboard/widget", "regex": "^/dashboard/widget(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/widget(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }, { "page": "/signup", "regex": "^/signup(?:/)?$", "routeKeys": {}, "namedRegex": "^/signup(?:/)?$" }, { "page": "/widget-demo", "regex": "^/widget\\-demo(?:/)?$", "routeKeys": {}, "namedRegex": "^/widget\\-demo(?:/)?$" }, { "page": "/widget-test", "regex": "^/widget\\-test(?:/)?$", "routeKeys": {}, "namedRegex": "^/widget\\-test(?:/)?$" }], "dynamic": [{ "page": "/portal/[appointmentId]", "regex": "^/portal/([^/]+?)(?:/)?$", "routeKeys": { "nxtPappointmentId": "nxtPappointmentId" }, "namedRegex": "^/portal/(?<nxtPappointmentId>[^/]+?)(?:/)?$" }, { "page": "/sites/[slug]", "regex": "^/sites/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/sites/(?<nxtPslug>[^/]+?)(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
    ConfigHeaders = [{ "source": "/:path*", "headers": [{ "key": "X-Content-Type-Options", "value": "nosniff" }, { "key": "X-Frame-Options", "value": "SAMEORIGIN" }, { "key": "X-XSS-Protection", "value": "1; mode=block" }, { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }, { "key": "Permissions-Policy", "value": "camera=(), geolocation=()" }], "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$" }, { "source": "/widget.js", "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }, { "key": "Content-Type", "value": "application/javascript" }], "regex": "^/widget\\.js(?:/)?$" }, { "source": "/api/widget/:path*", "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }, { "key": "Access-Control-Allow-Methods", "value": "GET, POST, OPTIONS" }, { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }], "regex": "^/api/widget(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$" }, { "source": "/api/realtime/:path*", "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }, { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" }, { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }], "regex": "^/api/realtime(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))?(?:/)?$" }, { "source": "/api/appointments/confirm", "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }, { "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" }, { "key": "Access-Control-Allow-Headers", "value": "Content-Type" }], "regex": "^/api/appointments/confirm(?:/)?$" }];
    PrerenderManifest = { "version": 4, "routes": { "/": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/", "dataRoute": "/index.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_global-error": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard", "dataRoute": "/dashboard.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/agents": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/agents", "dataRoute": "/dashboard/agents.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/appointments": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/appointments", "dataRoute": "/dashboard/appointments.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/clients": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/clients", "dataRoute": "/dashboard/clients.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/conversations": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/conversations", "dataRoute": "/dashboard/conversations.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/notifications": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/notifications", "dataRoute": "/dashboard/notifications.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/plans": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/plans", "dataRoute": "/dashboard/plans.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/properties": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/properties", "dataRoute": "/dashboard/properties.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/schedule": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/schedule", "dataRoute": "/dashboard/schedule.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/services": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/services", "dataRoute": "/dashboard/services.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/settings": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/settings", "dataRoute": "/dashboard/settings.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/support": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/support", "dataRoute": "/dashboard/support.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/website-builder": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/website-builder", "dataRoute": "/dashboard/website-builder.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/dashboard/widget": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/dashboard/widget", "dataRoute": "/dashboard/widget.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/login": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/login", "dataRoute": "/login.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/signup": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/signup", "dataRoute": "/signup.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/widget-demo": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/widget-demo", "dataRoute": "/widget-demo.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "a6925207c074d394f3ba94450b31d70a", "previewModeSigningKey": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732", "previewModeEncryptionKey": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07" } };
    AppPathsManifestKeys = ["/login", "/signup", "/dashboard/agents", "/dashboard/appointments", "/dashboard/clients", "/dashboard/conversations", "/dashboard/notifications", "/dashboard", "/dashboard/plans", "/dashboard/properties", "/dashboard/schedule", "/dashboard/services", "/dashboard/settings", "/dashboard/support", "/dashboard/website-builder", "/dashboard/widget", "/portal/[appointmentId]", "/_global-error", "/_not-found", "/api/auth/login/route", "/api/auth/logout/route", "/api/auth/signup/route", "/api/checkout/razorpay/route", "/api/checkout/razorpay/verify/route", "/api/checkout/route", "/api/dashboard/agents/route", "/api/dashboard/appointments/route", "/api/dashboard/conversations/route", "/api/dashboard/data/route", "/api/dashboard/properties/route", "/api/dashboard/settings/route", "/api/dashboard/support/route", "/api/search/route", "/api/sites/details/route", "/api/sites/portal/route", "/api/sites/support/route", "/api/upload/route", "/api/voice/book/route", "/api/voice/session/route", "/api/webhook/route", "/api/widget/details/route", "/api/widget/route", "/", "/sites/[slug]", "/widget-demo", "/widget-test/route"];
    MiddlewareManifest = { "version": 3, "middleware": {}, "sortedMiddleware": [], "functions": { "/(portal)/portal/[appointmentId]/page": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/next-font-manifest.js", "server/server-reference-manifest.js", "server/edge/chunks/ssr/_1hb7it6._.js", "server/edge/chunks/ssr/node_modules_next_dist_1xc97ap._.js", "server/edge/chunks/ssr/node_modules_0n8lg1c._.js", "server/edge/chunks/ssr/node_modules_next_dist_12nr_xk._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_1zxnqeb._.js", "server/edge/chunks/ssr/node_modules_next_dist_0iea_qs._.js", "server/edge/chunks/ssr/_18v_i7c._.js", "server/app/(portal)/portal/[appointmentId]/page_client-reference-manifest.js", "server/edge/chunks/ssr/_next-internal_server_app_(portal)_portal_[appointmentId]_page_actions_1td_b63.js", "server/edge/chunks/ssr/node_modules_next_dist_059m72z._.js", "server/edge/chunks/ssr/[root-of-the-server]__0qo9i8g._.js", "server/edge/chunks/ssr/node_modules_next_dist_compiled_0czwz5q._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_build_templates_edge-ssr-app_09yr-70.js", "server/edge/chunks/ssr/node_modules_next_dist_1h65na3._.js", "server/edge/chunks/ssr/[root-of-the-server]__1wdbuq1._.js", "server/edge/chunks/ssr/node_modules_next_dist_0hvoqp9._.js", "server/edge/chunks/ssr/node_modules_next_dist_1ygqhn3._.js", "server/edge/chunks/ssr/node_modules_0snrk9m._.js", "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_16yzgag.js", "server/app/(portal)/portal/[appointmentId]/page/react-loadable-manifest.js"], "name": "app/(portal)/portal/[appointmentId]/page", "page": "/(portal)/portal/[appointmentId]/page", "entrypoint": "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_16yzgag.js", "matchers": [{ "regexp": "^/portal/(?P<nxtPappointmentId>[^/]+?)(?:/)?$", "originalSource": "/portal/[appointmentId]" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/auth/login/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/auth/login/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_auth_login_route_actions_08uv61n.js", "server/edge/chunks/[root-of-the-server]__10qj5dg._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0vgcl9x.js"], "name": "app/api/auth/login/route", "page": "/api/auth/login/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0vgcl9x.js", "matchers": [{ "regexp": "^/api/auth/login(?:/)?$", "originalSource": "/api/auth/login" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/auth/logout/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/auth/logout/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_auth_logout_route_actions_06skg_j.js", "server/edge/chunks/[root-of-the-server]__1u2l_dw._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1e8hn95.js"], "name": "app/api/auth/logout/route", "page": "/api/auth/logout/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1e8hn95.js", "matchers": [{ "regexp": "^/api/auth/logout(?:/)?$", "originalSource": "/api/auth/logout" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/auth/signup/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/auth/signup/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_auth_signup_route_actions_1qt_6vn.js", "server/edge/chunks/[root-of-the-server]__1hv1glv._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0ax46z0.js"], "name": "app/api/auth/signup/route", "page": "/api/auth/signup/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0ax46z0.js", "matchers": [{ "regexp": "^/api/auth/signup(?:/)?$", "originalSource": "/api/auth/signup" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/checkout/razorpay/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/checkout/razorpay/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_checkout_razorpay_route_actions_1fx76n3.js", "server/edge/chunks/[root-of-the-server]__10g52yy._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0k31gzz.js"], "name": "app/api/checkout/razorpay/route", "page": "/api/checkout/razorpay/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0k31gzz.js", "matchers": [{ "regexp": "^/api/checkout/razorpay(?:/)?$", "originalSource": "/api/checkout/razorpay" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/checkout/razorpay/verify/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/checkout/razorpay/verify/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_checkout_razorpay_verify_route_actions_0ecowj6.js", "server/edge/chunks/[root-of-the-server]__16i7v9y._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0tma4au.js"], "name": "app/api/checkout/razorpay/verify/route", "page": "/api/checkout/razorpay/verify/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0tma4au.js", "matchers": [{ "regexp": "^/api/checkout/razorpay/verify(?:/)?$", "originalSource": "/api/checkout/razorpay/verify" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/checkout/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/checkout/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_checkout_route_actions_1d2-m1g.js", "server/edge/chunks/[root-of-the-server]__1ah81ku._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/node_modules_stripe_esm_stripe_esm_worker_0-fygh7.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1pdo33n.js"], "name": "app/api/checkout/route", "page": "/api/checkout/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1pdo33n.js", "matchers": [{ "regexp": "^/api/checkout(?:/)?$", "originalSource": "/api/checkout" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/dashboard/agents/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/dashboard/agents/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_dashboard_agents_route_actions_0dldble.js", "server/edge/chunks/[root-of-the-server]__0l8lyax._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0j-hky8.js"], "name": "app/api/dashboard/agents/route", "page": "/api/dashboard/agents/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0j-hky8.js", "matchers": [{ "regexp": "^/api/dashboard/agents(?:/)?$", "originalSource": "/api/dashboard/agents" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/dashboard/appointments/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/dashboard/appointments/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_dashboard_appointments_route_actions_1jw6y8y.js", "server/edge/chunks/[root-of-the-server]__10ubhpt._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0nyvdzm.js"], "name": "app/api/dashboard/appointments/route", "page": "/api/dashboard/appointments/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0nyvdzm.js", "matchers": [{ "regexp": "^/api/dashboard/appointments(?:/)?$", "originalSource": "/api/dashboard/appointments" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/dashboard/conversations/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/dashboard/conversations/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_dashboard_conversations_route_actions_1g85it3.js", "server/edge/chunks/[root-of-the-server]__0bns00o._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_20y7cvc.js"], "name": "app/api/dashboard/conversations/route", "page": "/api/dashboard/conversations/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_20y7cvc.js", "matchers": [{ "regexp": "^/api/dashboard/conversations(?:/)?$", "originalSource": "/api/dashboard/conversations" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/dashboard/data/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/dashboard/data/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_dashboard_data_route_actions_1hcavy5.js", "server/edge/chunks/[root-of-the-server]__1maup7w._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_08d4m66.js"], "name": "app/api/dashboard/data/route", "page": "/api/dashboard/data/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_08d4m66.js", "matchers": [{ "regexp": "^/api/dashboard/data(?:/)?$", "originalSource": "/api/dashboard/data" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/dashboard/properties/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/dashboard/properties/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_dashboard_properties_route_actions_1liodtc.js", "server/edge/chunks/[root-of-the-server]__10a4-2-._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0n-04gr.js"], "name": "app/api/dashboard/properties/route", "page": "/api/dashboard/properties/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0n-04gr.js", "matchers": [{ "regexp": "^/api/dashboard/properties(?:/)?$", "originalSource": "/api/dashboard/properties" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/dashboard/settings/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/dashboard/settings/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_dashboard_settings_route_actions_13ve1ju.js", "server/edge/chunks/[root-of-the-server]__1zmzu4v._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0lpxz20.js"], "name": "app/api/dashboard/settings/route", "page": "/api/dashboard/settings/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0lpxz20.js", "matchers": [{ "regexp": "^/api/dashboard/settings(?:/)?$", "originalSource": "/api/dashboard/settings" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/dashboard/support/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/dashboard/support/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_dashboard_support_route_actions_0o1bv3_.js", "server/edge/chunks/[root-of-the-server]__0y4q0a0._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_019b3k8.js"], "name": "app/api/dashboard/support/route", "page": "/api/dashboard/support/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_019b3k8.js", "matchers": [{ "regexp": "^/api/dashboard/support(?:/)?$", "originalSource": "/api/dashboard/support" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/search/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/search/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_search_route_actions_1m0szfa.js", "server/edge/chunks/[root-of-the-server]__11bnn6g._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_00ghy13.js"], "name": "app/api/search/route", "page": "/api/search/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_00ghy13.js", "matchers": [{ "regexp": "^/api/search(?:/)?$", "originalSource": "/api/search" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/sites/details/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/sites/details/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_sites_details_route_actions_08g5yyo.js", "server/edge/chunks/[root-of-the-server]__0tp9_z8._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1oogtu3.js"], "name": "app/api/sites/details/route", "page": "/api/sites/details/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1oogtu3.js", "matchers": [{ "regexp": "^/api/sites/details(?:/)?$", "originalSource": "/api/sites/details" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/sites/portal/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/sites/portal/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_sites_portal_route_actions_1usejp9.js", "server/edge/chunks/[root-of-the-server]__1mx0tt4._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_17_2i8l.js"], "name": "app/api/sites/portal/route", "page": "/api/sites/portal/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_17_2i8l.js", "matchers": [{ "regexp": "^/api/sites/portal(?:/)?$", "originalSource": "/api/sites/portal" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/sites/support/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/sites/support/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_sites_support_route_actions_1lwstsx.js", "server/edge/chunks/[root-of-the-server]__19a91cw._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_06ujqwh.js"], "name": "app/api/sites/support/route", "page": "/api/sites/support/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_06ujqwh.js", "matchers": [{ "regexp": "^/api/sites/support(?:/)?$", "originalSource": "/api/sites/support" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/upload/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/upload/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_upload_route_actions_0bfykrh.js", "server/edge/chunks/[root-of-the-server]__1lajqew._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/node_modules_1kkukn1._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_01pel6r.js"], "name": "app/api/upload/route", "page": "/api/upload/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_01pel6r.js", "matchers": [{ "regexp": "^/api/upload(?:/)?$", "originalSource": "/api/upload" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/voice/book/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/voice/book/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_voice_book_route_actions_0tniegs.js", "server/edge/chunks/[root-of-the-server]__08qa9vq._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/node_modules_@supabase_supabase-js_dist_index_mjs_0gykd6g._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0qrtqid.js"], "name": "app/api/voice/book/route", "page": "/api/voice/book/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0qrtqid.js", "matchers": [{ "regexp": "^/api/voice/book(?:/)?$", "originalSource": "/api/voice/book" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/voice/session/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/voice/session/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_voice_session_route_actions_1mzzmqo.js", "server/edge/chunks/[root-of-the-server]__20fwbzr._.js", "server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-app-route_1a38crr.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/node_modules_@supabase_supabase-js_dist_index_mjs_0gykd6g._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_19uv60e.js"], "name": "app/api/voice/session/route", "page": "/api/voice/session/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_19uv60e.js", "matchers": [{ "regexp": "^/api/voice/session(?:/)?$", "originalSource": "/api/voice/session" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/webhook/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/webhook/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_webhook_route_actions_0j9gado.js", "server/edge/chunks/[root-of-the-server]__1i9j62-._.js", "server/edge/chunks/node_modules_stripe_esm_stripe_esm_worker_0-fygh7.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/node_modules_@supabase_supabase-js_dist_index_mjs_0gykd6g._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_08sdttm.js"], "name": "app/api/webhook/route", "page": "/api/webhook/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_08sdttm.js", "matchers": [{ "regexp": "^/api/webhook(?:/)?$", "originalSource": "/api/webhook" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/widget/details/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/widget/details/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_widget_details_route_actions_1uy9qcz.js", "server/edge/chunks/[root-of-the-server]__1ujumva._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1i6m6bw.js"], "name": "app/api/widget/details/route", "page": "/api/widget/details/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1i6m6bw.js", "matchers": [{ "regexp": "^/api/widget/details(?:/)?$", "originalSource": "/api/widget/details" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/api/widget/route": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/server-reference-manifest.js", "server/app/api/widget/route_client-reference-manifest.js", "server/edge/chunks/_next-internal_server_app_api_widget_route_actions_02-fiut.js", "server/edge/chunks/[root-of-the-server]__0xiwa09._.js", "server/edge/chunks/node_modules_next_dist_10ig42v._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0tn3kel.js"], "name": "app/api/widget/route", "page": "/api/widget/route", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0tn3kel.js", "matchers": [{ "regexp": "^/api/widget(?:/)?$", "originalSource": "/api/widget" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } }, "/sites/[slug]/page": { "files": ["server/middleware-build-manifest.js", "server/interception-route-rewrite-manifest.js", "required-server-files.js", "server/next-font-manifest.js", "server/server-reference-manifest.js", "server/edge/chunks/ssr/_1hb7it6._.js", "server/edge/chunks/ssr/node_modules_next_dist_1xc97ap._.js", "server/edge/chunks/ssr/node_modules_0n8lg1c._.js", "server/edge/chunks/ssr/node_modules_next_dist_12nr_xk._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_1zxnqeb._.js", "server/edge/chunks/ssr/node_modules_next_dist_0iea_qs._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_0ekqgwh._.js", "server/edge/chunks/ssr/_01i8_1z._.js", "server/app/sites/[slug]/page_client-reference-manifest.js", "server/edge/chunks/ssr/_next-internal_server_app_sites_[slug]_page_actions_1p_1way.js", "server/edge/chunks/ssr/node_modules_next_dist_059m72z._.js", "server/edge/chunks/ssr/[root-of-the-server]__03q88sc._.js", "server/edge/chunks/ssr/node_modules_next_dist_compiled_0czwz5q._.js", "server/edge/chunks/ssr/node_modules_next_dist_esm_build_templates_edge-ssr-app_0j7omcw.js", "server/edge/chunks/ssr/node_modules_next_dist_1h65na3._.js", "server/edge/chunks/ssr/node_modules_next_dist_0hvoqp9._.js", "server/edge/chunks/ssr/[root-of-the-server]__1wdbuq1._.js", "server/edge/chunks/ssr/node_modules_next_dist_1ygqhn3._.js", "server/edge/chunks/ssr/node_modules_0snrk9m._.js", "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0rkbkyg.js", "server/app/sites/[slug]/page/react-loadable-manifest.js"], "name": "app/sites/[slug]/page", "page": "/sites/[slug]/page", "entrypoint": "server/edge/chunks/ssr/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_0rkbkyg.js", "matchers": [{ "regexp": "^/sites/(?P<nxtPslug>[^/]+?)(?:/)?$", "originalSource": "/sites/[slug]" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "iMPw1TiqUTPcKVSJf4zRU", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "hYy/haUS7sv0+ays67PyrfrY4ut23F4qcKhMBCPhiYE=", "__NEXT_PREVIEW_MODE_ID": "a6925207c074d394f3ba94450b31d70a", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "857b68d8ccf98f3c1c31e798034bfb5080b9a0b03c3ec98f40ebde0f8c666d07", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "15c8e89fa87efa9a7d3bf8f41aed70487366ef65dbc8dfbed6a93cbaf9bcd732" } } } };
    AppPathsManifest = { "/(auth)/login/page": "app/(auth)/login/page.js", "/(auth)/signup/page": "app/(auth)/signup/page.js", "/(dashboard)/dashboard/agents/page": "app/(dashboard)/dashboard/agents/page.js", "/(dashboard)/dashboard/appointments/page": "app/(dashboard)/dashboard/appointments/page.js", "/(dashboard)/dashboard/clients/page": "app/(dashboard)/dashboard/clients/page.js", "/(dashboard)/dashboard/conversations/page": "app/(dashboard)/dashboard/conversations/page.js", "/(dashboard)/dashboard/notifications/page": "app/(dashboard)/dashboard/notifications/page.js", "/(dashboard)/dashboard/page": "app/(dashboard)/dashboard/page.js", "/(dashboard)/dashboard/plans/page": "app/(dashboard)/dashboard/plans/page.js", "/(dashboard)/dashboard/properties/page": "app/(dashboard)/dashboard/properties/page.js", "/(dashboard)/dashboard/schedule/page": "app/(dashboard)/dashboard/schedule/page.js", "/(dashboard)/dashboard/services/page": "app/(dashboard)/dashboard/services/page.js", "/(dashboard)/dashboard/settings/page": "app/(dashboard)/dashboard/settings/page.js", "/(dashboard)/dashboard/support/page": "app/(dashboard)/dashboard/support/page.js", "/(dashboard)/dashboard/website-builder/page": "app/(dashboard)/dashboard/website-builder/page.js", "/(dashboard)/dashboard/widget/page": "app/(dashboard)/dashboard/widget/page.js", "/(portal)/portal/[appointmentId]/page": "app-edge-has-no-entrypoint", "/_global-error/page": "app/_global-error/page.js", "/_not-found/page": "app/_not-found/page.js", "/api/auth/login/route": "app-edge-has-no-entrypoint", "/api/auth/logout/route": "app-edge-has-no-entrypoint", "/api/auth/signup/route": "app-edge-has-no-entrypoint", "/api/checkout/razorpay/route": "app-edge-has-no-entrypoint", "/api/checkout/razorpay/verify/route": "app-edge-has-no-entrypoint", "/api/checkout/route": "app-edge-has-no-entrypoint", "/api/dashboard/agents/route": "app-edge-has-no-entrypoint", "/api/dashboard/appointments/route": "app-edge-has-no-entrypoint", "/api/dashboard/conversations/route": "app-edge-has-no-entrypoint", "/api/dashboard/data/route": "app-edge-has-no-entrypoint", "/api/dashboard/properties/route": "app-edge-has-no-entrypoint", "/api/dashboard/settings/route": "app-edge-has-no-entrypoint", "/api/dashboard/support/route": "app-edge-has-no-entrypoint", "/api/search/route": "app-edge-has-no-entrypoint", "/api/sites/details/route": "app-edge-has-no-entrypoint", "/api/sites/portal/route": "app-edge-has-no-entrypoint", "/api/sites/support/route": "app-edge-has-no-entrypoint", "/api/upload/route": "app-edge-has-no-entrypoint", "/api/voice/book/route": "app-edge-has-no-entrypoint", "/api/voice/session/route": "app-edge-has-no-entrypoint", "/api/webhook/route": "app-edge-has-no-entrypoint", "/api/widget/details/route": "app-edge-has-no-entrypoint", "/api/widget/route": "app-edge-has-no-entrypoint", "/page": "app/page.js", "/sites/[slug]/page": "app-edge-has-no-entrypoint", "/widget-demo/page": "app/widget-demo/page.js", "/widget-test/route": "app/widget-test/route.js" };
    AppPathRoutesManifest = { "/(auth)/login/page": "/login", "/(auth)/signup/page": "/signup", "/(dashboard)/dashboard/agents/page": "/dashboard/agents", "/(dashboard)/dashboard/appointments/page": "/dashboard/appointments", "/(dashboard)/dashboard/clients/page": "/dashboard/clients", "/(dashboard)/dashboard/conversations/page": "/dashboard/conversations", "/(dashboard)/dashboard/notifications/page": "/dashboard/notifications", "/(dashboard)/dashboard/page": "/dashboard", "/(dashboard)/dashboard/plans/page": "/dashboard/plans", "/(dashboard)/dashboard/properties/page": "/dashboard/properties", "/(dashboard)/dashboard/schedule/page": "/dashboard/schedule", "/(dashboard)/dashboard/services/page": "/dashboard/services", "/(dashboard)/dashboard/settings/page": "/dashboard/settings", "/(dashboard)/dashboard/support/page": "/dashboard/support", "/(dashboard)/dashboard/website-builder/page": "/dashboard/website-builder", "/(dashboard)/dashboard/widget/page": "/dashboard/widget", "/(portal)/portal/[appointmentId]/page": "/portal/[appointmentId]", "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/api/auth/login/route": "/api/auth/login", "/api/auth/logout/route": "/api/auth/logout", "/api/auth/signup/route": "/api/auth/signup", "/api/checkout/razorpay/route": "/api/checkout/razorpay", "/api/checkout/razorpay/verify/route": "/api/checkout/razorpay/verify", "/api/checkout/route": "/api/checkout", "/api/dashboard/agents/route": "/api/dashboard/agents", "/api/dashboard/appointments/route": "/api/dashboard/appointments", "/api/dashboard/conversations/route": "/api/dashboard/conversations", "/api/dashboard/data/route": "/api/dashboard/data", "/api/dashboard/properties/route": "/api/dashboard/properties", "/api/dashboard/settings/route": "/api/dashboard/settings", "/api/dashboard/support/route": "/api/dashboard/support", "/api/search/route": "/api/search", "/api/sites/details/route": "/api/sites/details", "/api/sites/portal/route": "/api/sites/portal", "/api/sites/support/route": "/api/sites/support", "/api/upload/route": "/api/upload", "/api/voice/book/route": "/api/voice/book", "/api/voice/session/route": "/api/voice/session", "/api/webhook/route": "/api/webhook", "/api/widget/details/route": "/api/widget/details", "/api/widget/route": "/api/widget", "/page": "/", "/sites/[slug]/page": "/sites/[slug]", "/widget-demo/page": "/widget-demo", "/widget-test/route": "/widget-test" };
    FunctionsConfigManifest = { "version": 1, "functions": { "/api/auth/login": {}, "/api/auth/logout": {}, "/api/auth/signup": {}, "/api/checkout": {}, "/api/checkout/razorpay": {}, "/api/checkout/razorpay/verify": {}, "/api/dashboard/agents": {}, "/api/dashboard/appointments": {}, "/api/dashboard/conversations": {}, "/api/dashboard/data": {}, "/api/dashboard/properties": {}, "/api/dashboard/settings": {}, "/api/dashboard/support": {}, "/api/search": {}, "/api/sites/details": {}, "/api/sites/portal": {}, "/api/sites/support": {}, "/api/upload": {}, "/api/voice/book": {}, "/api/voice/session": {}, "/api/webhook": {}, "/api/widget": {}, "/api/widget/details": {}, "/portal/[appointmentId]": {}, "/sites/[slug]": {} } };
    PagesManifest = { "/404": "pages/404.html", "/500": "pages/500.html" };
    process.env.NEXT_BUILD_ID = BuildId;
    process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
    process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;
  }
});

// node-built-in-modules:node:module
var node_module_exports = {};
import * as node_module_star from "node:module";
var init_node_module = __esm({
  "node-built-in-modules:node:module"() {
    __reExport(node_module_exports, node_module_star);
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/@opennextjs/aws/node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-node.js
var cloudflare_node_exports = {};
__export(cloudflare_node_exports, {
  default: () => cloudflare_node_default
});
import { Writable } from "node:stream";
var NULL_BODY_STATUSES2, handler, cloudflare_node_default;
var init_cloudflare_node = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-node.js"() {
    NULL_BODY_STATUSES2 = /* @__PURE__ */ new Set([101, 204, 205, 304]);
    handler = async (handler3, converter2) => async (request, env, ctx, abortSignal) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const url = new URL(request.url);
      const { promise: promiseResponse, resolve: resolveResponse } = Promise.withResolvers();
      const streamCreator = {
        writeHeaders(prelude) {
          const { statusCode, cookies, headers } = prelude;
          const responseHeaders = new Headers(headers);
          for (const cookie of cookies) {
            responseHeaders.append("Set-Cookie", cookie);
          }
          if (url.hostname === "localhost") {
            responseHeaders.set("Content-Encoding", "identity");
          }
          if (NULL_BODY_STATUSES2.has(statusCode)) {
            const response2 = new Response(null, {
              status: statusCode,
              headers: responseHeaders
            });
            resolveResponse(response2);
            return new Writable({
              write(chunk, encoding, callback) {
                callback();
              }
            });
          }
          let controller;
          const readable = new ReadableStream({
            start(c) {
              controller = c;
            }
          });
          const response = new Response(readable, {
            status: statusCode,
            headers: responseHeaders
          });
          resolveResponse(response);
          return new Writable({
            write(chunk, encoding, callback) {
              try {
                controller.enqueue(chunk);
              } catch (e) {
                return callback(e);
              }
              callback();
            },
            final(callback) {
              controller.close();
              callback();
            },
            destroy(error2, callback) {
              if (error2) {
                controller.error(error2);
              } else {
                try {
                  controller.close();
                } catch {
                }
              }
              callback(error2);
            }
          });
        },
        // This is for passing along the original abort signal from the initial Request you retrieve in your worker
        // Ensures that the response we pass to NextServer is aborted if the request is aborted
        // By doing this `request.signal.onabort` will work in route handlers
        abortSignal,
        // There is no need to retain the chunks that were pushed to the response stream.
        retainChunks: false
      };
      ctx.waitUntil(handler3(internalEvent, {
        streamCreator,
        waitUntil: ctx.waitUntil.bind(ctx)
      }));
      return promiseResponse;
    };
    cloudflare_node_default = {
      wrapper: handler,
      name: "cloudflare-node",
      supportStreaming: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/tagCache/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var dummyTagCache, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/tagCache/dummy.js"() {
    dummyTagCache = {
      name: "dummy",
      mode: "original",
      getByPath: async () => {
        return [];
      },
      getByTag: async () => {
        return [];
      },
      getLastModified: async (_, lastModified) => {
        return lastModified ?? Date.now();
      },
      writeTags: async () => {
        return;
      },
      isStale: async (_path) => {
        return false;
      }
    };
    dummy_default = dummyTagCache;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/queue/direct.js
var direct_exports = {};
__export(direct_exports, {
  default: () => direct_default
});
var queue, direct_default;
var init_direct = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/queue/direct.js"() {
    queue = {
      name: "dev-queue",
      send: async (message) => {
        const prerenderManifest = (await Promise.resolve().then(() => (init_config(), config_exports))).PrerenderManifest;
        const { host, url } = message.MessageBody;
        const protocol = host.includes("localhost") ? "http" : "https";
        const revalidateId = prerenderManifest.preview.previewModeId;
        await globalThis.internalFetch(`${protocol}://${host}${url}`, {
          method: "HEAD",
          headers: {
            "x-prerender-revalidate": revalidateId,
            "x-isr": "1"
          }
        });
      }
    };
    direct_default = queue;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/incrementalCache/dummy.js
var dummy_exports2 = {};
__export(dummy_exports2, {
  default: () => dummy_default2
});
var dummyIncrementalCache, dummy_default2;
var init_dummy2 = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/incrementalCache/dummy.js"() {
    init_error();
    dummyIncrementalCache = {
      name: "dummy",
      get: async () => {
        throw new IgnorableError('"Dummy" cache does not cache anything');
      },
      set: async () => {
        throw new IgnorableError('"Dummy" cache does not cache anything');
      },
      delete: async () => {
        throw new IgnorableError('"Dummy" cache does not cache anything');
      }
    };
    dummy_default2 = dummyIncrementalCache;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports3 = {};
__export(dummy_exports3, {
  default: () => dummy_default3
});
var resolver, dummy_default3;
var init_dummy3 = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default3 = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/cdnInvalidation/dummy.js
var dummy_exports4 = {};
__export(dummy_exports4, {
  default: () => dummy_default4
});
var dummy_default4;
var init_dummy4 = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/cdnInvalidation/dummy.js"() {
    dummy_default4 = {
      name: "dummy",
      invalidatePaths: (_) => {
        return Promise.resolve();
      }
    };
  }
});

// node_modules/@opennextjs/aws/dist/core/createMainHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/adapters/util.js
function setNodeEnv() {
  const processEnv = process.env;
  processEnv.NODE_ENV = process.env.NODE_ENV ?? "production";
}
function generateUniqueId() {
  return Math.random().toString(36).slice(2, 8);
}

// node_modules/@opennextjs/aws/dist/core/requestHandler.js
import { AsyncLocalStorage } from "node:async_hooks";

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";
var SET_COOKIE_HEADER = "set-cookie";
var CANNOT_BE_USED = "This cannot be used in OpenNext";
var OpenNextNodeResponse = class extends Transform {
  fixHeadersFn;
  onEnd;
  streamCreator;
  initialHeaders;
  statusCode;
  statusMessage = "";
  headers = {};
  headersSent = false;
  _chunks = [];
  headersAlreadyFixed = false;
  _cookies = [];
  responseStream;
  bodyLength = 0;
  // To comply with the ServerResponse interface :
  strictContentLength = false;
  assignSocket(_socket) {
    throw new Error(CANNOT_BE_USED);
  }
  detachSocket(_socket) {
    throw new Error(CANNOT_BE_USED);
  }
  // We might have to revisit those 3 in the future
  writeContinue(_callback) {
    throw new Error(CANNOT_BE_USED);
  }
  writeEarlyHints(_hints, _callback) {
    throw new Error(CANNOT_BE_USED);
  }
  writeProcessing() {
    throw new Error(CANNOT_BE_USED);
  }
  /**
   * This is a dummy request object to comply with the ServerResponse interface
   * It will never be defined
   */
  req;
  chunkedEncoding = false;
  shouldKeepAlive = true;
  useChunkedEncodingByDefault = true;
  sendDate = false;
  connection = null;
  socket = null;
  setTimeout(_msecs, _callback) {
    throw new Error(CANNOT_BE_USED);
  }
  addTrailers(_headers) {
    throw new Error(CANNOT_BE_USED);
  }
  constructor(fixHeadersFn, onEnd, streamCreator, initialHeaders, statusCode) {
    super();
    this.fixHeadersFn = fixHeadersFn;
    this.onEnd = onEnd;
    this.streamCreator = streamCreator;
    this.initialHeaders = initialHeaders;
    if (statusCode && Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599) {
      this.statusCode = statusCode;
    }
    streamCreator?.abortSignal?.addEventListener("abort", () => {
      this.destroy();
    });
  }
  // Necessary for next 12
  // We might have to implement all the methods here
  get originalResponse() {
    return this;
  }
  get finished() {
    return this.responseStream ? this.responseStream?.writableFinished : this.writableFinished;
  }
  setHeader(name, value) {
    const key = name.toLowerCase();
    if (key === SET_COOKIE_HEADER) {
      if (Array.isArray(value)) {
        this._cookies = value;
      } else {
        this._cookies = [value];
      }
    }
    this.headers[key] = value;
    return this;
  }
  removeHeader(name) {
    const key = name.toLowerCase();
    if (key === SET_COOKIE_HEADER) {
      this._cookies = [];
    } else {
      delete this.headers[key];
    }
    return this;
  }
  hasHeader(name) {
    const key = name.toLowerCase();
    if (key === SET_COOKIE_HEADER) {
      return this._cookies.length > 0;
    }
    return this.headers[key] !== void 0;
  }
  getHeaders() {
    return this.headers;
  }
  getHeader(name) {
    return this.headers[name.toLowerCase()];
  }
  getHeaderNames() {
    return Object.keys(this.headers);
  }
  // Only used directly in next@14+
  flushHeaders() {
    this.headersSent = true;
    const mergeHeadersPriority = globalThis.__openNextAls?.getStore()?.mergeHeadersPriority ?? "middleware";
    if (this.initialHeaders) {
      this.headers = mergeHeadersPriority === "middleware" ? {
        ...this.headers,
        ...this.initialHeaders
      } : {
        ...this.initialHeaders,
        ...this.headers
      };
      const initialCookies = parseSetCookieHeader(this.initialHeaders[SET_COOKIE_HEADER]?.toString());
      this._cookies = mergeHeadersPriority === "middleware" ? [...this._cookies, ...initialCookies] : [...initialCookies, ...this._cookies];
    }
    this.fixHeaders(this.headers);
    this.fixHeadersForError();
    this.headers[SET_COOKIE_HEADER] = this._cookies;
    const parsedHeaders = parseHeaders(this.headers);
    delete parsedHeaders[SET_COOKIE_HEADER];
    if (this.streamCreator) {
      this.responseStream = this.streamCreator?.writeHeaders({
        statusCode: this.statusCode ?? 200,
        cookies: this._cookies,
        headers: parsedHeaders
      });
      this.pipe(this.responseStream);
    }
  }
  appendHeader(name, value) {
    const key = name.toLowerCase();
    if (!this.hasHeader(key)) {
      return this.setHeader(key, value);
    }
    const existingHeader = this.getHeader(key);
    const toAppend = Array.isArray(value) ? value : [value];
    const newValue = Array.isArray(existingHeader) ? [...existingHeader, ...toAppend] : [existingHeader, ...toAppend];
    return this.setHeader(key, newValue);
  }
  writeHead(statusCode, statusMessage, headers) {
    let _headers = headers;
    let _statusMessage;
    if (typeof statusMessage === "string") {
      _statusMessage = statusMessage;
    } else {
      _headers = statusMessage;
    }
    const finalHeaders = this.headers;
    if (_headers) {
      if (Array.isArray(_headers)) {
        for (let i = 0; i < _headers.length; i += 2) {
          finalHeaders[_headers[i]] = _headers[i + 1];
        }
      } else {
        for (const key of Object.keys(_headers)) {
          finalHeaders[key] = _headers[key];
        }
      }
    }
    this.statusCode = statusCode;
    if (headers) {
      this.headers = finalHeaders;
    }
    this.flushHeaders();
    return this;
  }
  /**
   * OpenNext specific method
   */
  fixHeaders(headers) {
    if (this.headersAlreadyFixed) {
      return;
    }
    this.fixHeadersFn(headers);
    this.headersAlreadyFixed = true;
  }
  getFixedHeaders() {
    this.fixHeaders(this.headers);
    this.fixHeadersForError();
    this.headers[SET_COOKIE_HEADER] = this._cookies;
    return this.headers;
  }
  getBody() {
    return Buffer.concat(this._chunks);
  }
  _internalWrite(chunk, encoding) {
    const buffer = encoding === "buffer" ? chunk : Buffer.from(chunk, encoding);
    this.bodyLength += buffer.length;
    if (this.streamCreator?.retainChunks !== false) {
      this._chunks.push(buffer);
    }
    this.push(buffer);
    this.streamCreator?.onWrite?.();
  }
  _transform(chunk, encoding, callback) {
    if (!this.headersSent) {
      this.flushHeaders();
    }
    this._internalWrite(chunk, encoding);
    callback();
  }
  _flush(callback) {
    if (!this.headersSent) {
      this.flushHeaders();
    }
    globalThis.__openNextAls?.getStore()?.pendingPromiseRunner.add(this.onEnd(this.headers));
    this.streamCreator?.onFinish?.(this.bodyLength);
    if (this.bodyLength === 0 && // We use an env variable here because not all aws account have the same behavior
    // On some aws accounts the response will hang if the body is empty
    // We are modifying the response body here, this is not a good practice
    process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
      debug('Force writing "SOMETHING" to the response body');
      this.push("SOMETHING");
    }
    callback();
  }
  /**
   * New method in Node 18.15+
   * There are probably not used right now in Next.js, but better be safe than sorry
   */
  setHeaders(headers) {
    headers.forEach((value, key) => {
      this.setHeader(key, Array.isArray(value) ? value : value.toString());
    });
    return this;
  }
  /**
   * Next specific methods
   * On earlier versions of next.js, those methods are mandatory to make everything work
   */
  get sent() {
    return this.finished || this.headersSent;
  }
  getHeaderValues(name) {
    const values = this.getHeader(name);
    if (values === void 0)
      return void 0;
    return (Array.isArray(values) ? values : [values]).map((value) => value.toString());
  }
  send() {
    for (const chunk of this._chunks) {
      this.write(chunk);
    }
    this.end();
  }
  body(value) {
    this.write(value);
    return this;
  }
  onClose(callback) {
    this.on("close", callback);
  }
  redirect(destination, statusCode) {
    this.setHeader("Location", destination);
    this.statusCode = statusCode;
    if (statusCode === 308) {
      this.setHeader("Refresh", `0;url=${destination}`);
    }
    return this;
  }
  // For some reason, next returns the 500 error page with some cache-control headers
  // We need to fix that
  fixHeadersForError() {
    if (process.env.OPEN_NEXT_DANGEROUSLY_SET_ERROR_HEADERS === "true") {
      return;
    }
    if (this.statusCode === 404 || this.statusCode === 500) {
      this.headers["cache-control"] = "private, no-cache, no-store, max-age=0, must-revalidate";
    }
  }
};

// node_modules/@opennextjs/aws/dist/http/request.js
import http from "node:http";
var IncomingMessage = class extends http.IncomingMessage {
  constructor({ method, url, headers, body, remoteAddress }) {
    super({
      encrypted: true,
      readable: false,
      remoteAddress,
      address: () => ({ port: 443 }),
      end: Function.prototype,
      destroy: Function.prototype
    });
    if (body) {
      headers["content-length"] ??= String(Buffer.byteLength(body));
    }
    Object.assign(this, {
      ip: remoteAddress,
      complete: true,
      httpVersion: "1.1",
      httpVersionMajor: "1",
      httpVersionMinor: "1",
      method,
      headers,
      body,
      url
    });
    this._read = () => {
      this.push(body);
      this.push(null);
    };
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/core/requestHandler.js
init_config();
init_logger();

// node_modules/@opennextjs/aws/dist/core/patchAsyncStorage.js
var mod = (init_node_module(), __toCommonJS(node_module_exports));
var resolveFilename = mod._resolveFilename;

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto from "node:crypto";
init_config();
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_config();
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path2) {
  return NextConfig.i18n?.locales.includes(path2.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function constructNextUrl(baseUrl, path2) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path2}`, baseUrl);
  return url.href;
}
function convertRes(res) {
  const statusCode = res.statusCode || 200;
  const headers = parseHeaders(res.getFixedHeaders());
  const isBase64Encoded = isBinaryContentType(headers["content-type"]) || !!headers["content-encoding"];
  const body = new ReadableStream3({
    pull(controller) {
      if (!res._chunks || res._chunks.length === 0) {
        controller.close();
        return;
      }
      controller.enqueue(res._chunks.shift());
    }
  });
  return {
    type: "core",
    statusCode,
    headers,
    body,
    isBase64Encoded
  };
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function convertToQuery(querystring) {
  if (!querystring)
    return {};
  const query = new URLSearchParams(querystring);
  const queryObject = {};
  for (const key of query.keys()) {
    const queries = query.getAll(key);
    queryObject[key] = queries.length > 1 ? queries : queries[0];
  }
  return queryObject;
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function fixCacheHeaderForHtmlPages(internalEvent, headers) {
  if (internalEvent.rawPath === "/404" || internalEvent.rawPath === "/500") {
    if (process.env.OPEN_NEXT_DANGEROUSLY_SET_ERROR_HEADERS === "true") {
      return;
    }
    headers[CommonHeaders.CACHE_CONTROL] = "private, no-cache, no-store, max-age=0, must-revalidate";
    return;
  }
  const localizedPath = localizePath(internalEvent);
  if (HtmlPages.includes(localizedPath) && !internalEvent.headers["x-middleware-prefetch"]) {
    headers[CommonHeaders.CACHE_CONTROL] = "public, max-age=0, s-maxage=31536000, must-revalidate";
  }
}
function fixSWRCacheHeader(headers) {
  let cacheControl = headers[CommonHeaders.CACHE_CONTROL];
  if (!cacheControl)
    return;
  if (Array.isArray(cacheControl)) {
    cacheControl = cacheControl.join(",");
  }
  if (typeof cacheControl !== "string")
    return;
  headers[CommonHeaders.CACHE_CONTROL] = cacheControl.replace(/\bstale-while-revalidate(?!=)/, "stale-while-revalidate=2592000");
}
function addOpenNextHeader(headers) {
  if (NextConfig.poweredByHeader) {
    headers["X-OpenNext"] = "1";
  }
  if (globalThis.openNextDebug) {
    headers["X-OpenNext-Version"] = globalThis.openNextVersion;
  }
  if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
    headers["X-OpenNext-RequestId"] = globalThis.__openNextAls.getStore()?.requestId;
  }
}
async function revalidateIfRequired(host, rawPath, headers, req) {
  if (headers[CommonHeaders.NEXT_CACHE] === "STALE") {
    const internalMeta = req?.[Symbol.for("NextInternalRequestMeta")];
    const revalidateUrl = internalMeta?._nextDidRewrite ? rawPath.startsWith("/_next/data/") ? `/_next/data/${BuildId}${internalMeta?._nextRewroteUrl}.json` : internalMeta?._nextRewroteUrl : rawPath;
    try {
      const hash = (str) => crypto.createHash("md5").update(str).digest("hex");
      const lastModified = globalThis.__openNextAls.getStore()?.lastModified ?? 0;
      const eTag = `${headers.etag ?? headers.ETag ?? ""}`;
      await globalThis.queue.send({
        MessageBody: { host, url: revalidateUrl, eTag, lastModified },
        MessageDeduplicationId: hash(`${rawPath}-${lastModified}-${eTag}`),
        MessageGroupId: generateMessageGroupId(rawPath)
      });
    } catch (e) {
      error(`Failed to revalidate stale page ${rawPath}`, e);
    }
  }
}
function fixISRHeaders(headers) {
  const sMaxAgeRegex = /s-maxage=(\d+)/;
  const match = headers[CommonHeaders.CACHE_CONTROL]?.match(sMaxAgeRegex);
  const sMaxAge = match ? Number.parseInt(match[1]) : void 0;
  if (!sMaxAge) {
    return;
  }
  if (headers[CommonHeaders.NEXT_CACHE] === "REVALIDATED") {
    headers[CommonHeaders.CACHE_CONTROL] = "private, no-cache, no-store, max-age=0, must-revalidate";
    return;
  }
  const _lastModified = globalThis.__openNextAls.getStore()?.lastModified ?? 0;
  if (headers[CommonHeaders.NEXT_CACHE] === "HIT" && _lastModified > 0) {
    debug("cache-control", headers[CommonHeaders.CACHE_CONTROL], _lastModified, Date.now());
    if (sMaxAge && sMaxAge !== 31536e3) {
      const age = Math.round((Date.now() - _lastModified) / 1e3);
      const remainingTtl = Math.max(sMaxAge - age, 1);
      headers[CommonHeaders.CACHE_CONTROL] = `s-maxage=${remainingTtl}, stale-while-revalidate=2592000`;
    }
  }
  if (headers[CommonHeaders.NEXT_CACHE] !== "STALE")
    return;
  headers[CommonHeaders.CACHE_CONTROL] = "s-maxage=2, stale-while-revalidate=2592000";
}
function createServerResponse(routingResult, headers, responseStream) {
  const internalEvent = routingResult.internalEvent;
  return new OpenNextNodeResponse((_headers) => {
    fixCacheHeaderForHtmlPages(internalEvent, _headers);
    fixSWRCacheHeader(_headers);
    addOpenNextHeader(_headers);
    fixISRHeaders(_headers);
  }, async (_headers) => {
    await revalidateIfRequired(internalEvent.headers.host, internalEvent.rawPath, _headers);
    await invalidateCDNOnRequest(routingResult, _headers);
  }, responseStream, headers, routingResult.rewriteStatusCode);
}
async function invalidateCDNOnRequest(params, headers) {
  const { internalEvent, resolvedRoutes, initialURL } = params;
  const initialPath = new URL(initialURL).pathname;
  const isIsrRevalidation = internalEvent.headers["x-isr"] === "1";
  if (!isIsrRevalidation && headers[CommonHeaders.NEXT_CACHE] === "REVALIDATED") {
    await globalThis.cdnInvalidationHandler.invalidatePaths([
      {
        initialPath,
        rawPath: internalEvent.rawPath,
        resolvedRoutes
      }
    ]);
  }
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_config();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_config();
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_config();
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
init_config();
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path2) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path2));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_config();
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;

// node_modules/@opennextjs/aws/dist/core/util.js
init_config();
init_logger();
import NextServer from "next/dist/server/next-server.js";

// node_modules/@opennextjs/aws/dist/core/require-hooks.js
init_logger();
var mod2 = (init_node_module(), __toCommonJS(node_module_exports));
var resolveFilename2 = mod2._resolveFilename;

// node_modules/@opennextjs/aws/dist/core/util.js
var cacheHandlerPath = __require.resolve("./cache.cjs");
var composableCacheHandlerPath = __require.resolve("./composable-cache.cjs");
var nextServer = new NextServer.default({
  conf: {
    ...NextConfig,
    // Next.js compression should be disabled because of a bug in the bundled
    // `compression` package — https://github.com/vercel/next.js/issues/11669
    compress: false,
    // By default, Next.js uses local disk to store ISR cache. We will use
    // our own cache handler to store the cache on S3.
    //#override stableIncrementalCache
    cacheHandler: cacheHandlerPath,
    cacheMaxMemorySize: 0,
    // We need to disable memory cache
    //#endOverride
    experimental: {
      ...NextConfig.experimental,
      // This uses the request.headers.host as the URL
      // https://github.com/vercel/next.js/blob/canary/packages/next/src/server/next-server.ts#L1749-L1754
      //#override trustHostHeader
      trustHostHeader: true,
      //#endOverride
      //#override composableCache
      cacheHandlers: {
        default: composableCacheHandlerPath
      }
      //#endOverride
    }
  },
  customServer: false,
  dev: false,
  dir: __dirname
});
var routesLoaded = false;
globalThis.__next_route_preloader = async (stage) => {
  if (routesLoaded) {
    return;
  }
  const thisFunction = globalThis.fnName ? globalThis.openNextConfig.functions[globalThis.fnName] : globalThis.openNextConfig.default;
  const routePreloadingBehavior = thisFunction?.routePreloadingBehavior ?? "none";
  if (routePreloadingBehavior === "none") {
    routesLoaded = true;
    return;
  }
  if (!("unstable_preloadEntries" in nextServer)) {
    debug("The current version of Next.js does not support route preloading. Skipping route preloading.");
    routesLoaded = true;
    return;
  }
  if (stage === "waitUntil" && routePreloadingBehavior === "withWaitUntil") {
    const waitUntil = globalThis.__openNextAls.getStore()?.waitUntil;
    if (!waitUntil) {
      error("You've tried to use the 'withWaitUntil' route preloading behavior, but the 'waitUntil' function is not available.");
      routesLoaded = true;
      return;
    }
    debug("Preloading entries with waitUntil");
    waitUntil?.(nextServer.unstable_preloadEntries());
    routesLoaded = true;
  } else if (stage === "start" && routePreloadingBehavior === "onStart" || stage === "warmerEvent" && routePreloadingBehavior === "onWarmerEvent" || stage === "onDemand") {
    const startTimestamp = Date.now();
    debug("Preloading entries");
    await nextServer.unstable_preloadEntries();
    debug("Preloading entries took", Date.now() - startTimestamp, "ms");
    routesLoaded = true;
  }
};
var requestHandler = (metadata) => "getRequestHandlerWithMetadata" in nextServer ? nextServer.getRequestHandlerWithMetadata(metadata) : nextServer.getRequestHandler();

// node_modules/@opennextjs/aws/dist/core/requestHandler.js
globalThis.__openNextAls = new AsyncLocalStorage();
async function openNextHandler(internalEvent, options) {
  const initialHeaders = internalEvent.headers;
  const requestId = globalThis.openNextConfig.middleware?.external ? internalEvent.headers[INTERNAL_EVENT_REQUEST_ID] : Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: initialHeaders["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    await globalThis.__next_route_preloader("waitUntil");
    if (initialHeaders["x-forwarded-host"]) {
      initialHeaders.host = initialHeaders["x-forwarded-host"];
    }
    debug("internalEvent", internalEvent);
    const internalHeaders = {
      initialPath: initialHeaders[INTERNAL_HEADER_INITIAL_URL] ?? internalEvent.rawPath,
      resolvedRoutes: initialHeaders[INTERNAL_HEADER_RESOLVED_ROUTES] ? JSON.parse(initialHeaders[INTERNAL_HEADER_RESOLVED_ROUTES]) : [],
      rewriteStatusCode: Number.parseInt(initialHeaders[INTERNAL_HEADER_REWRITE_STATUS_CODE])
    };
    let routingResult = {
      internalEvent,
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      initialURL: internalEvent.url,
      ...internalHeaders
    };
    const headers = "type" in routingResult ? routingResult.headers : routingResult.internalEvent.headers;
    const overwrittenResponseHeaders = {};
    for (const [rawKey, value] of Object.entries(headers)) {
      if (!rawKey.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        continue;
      }
      const key = rawKey.slice(MIDDLEWARE_HEADER_PREFIX_LEN);
      if (key !== "x-middleware-set-cookie") {
        overwrittenResponseHeaders[key] = value;
      }
      headers[key] = value;
      delete headers[rawKey];
    }
    if ("isExternalRewrite" in routingResult && routingResult.isExternalRewrite === true) {
      try {
        routingResult = await globalThis.proxyExternalRequest.proxy(routingResult.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        routingResult = {
          internalEvent: {
            type: "core",
            rawPath: "/500",
            method: "GET",
            headers: {},
            url: constructNextUrl(internalEvent.url, "/500"),
            query: {},
            cookies: {},
            remoteAddress: ""
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          isISR: false,
          origin: false,
          initialURL: internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if ("type" in routingResult) {
      if (options?.streamCreator) {
        const response = createServerResponse({
          internalEvent,
          isExternalRewrite: false,
          isISR: false,
          resolvedRoutes: [],
          origin: false,
          initialURL: internalEvent.url
        }, routingResult.headers, options.streamCreator);
        response.statusCode = routingResult.statusCode;
        response.flushHeaders();
        const [bodyToConsume, bodyToReturn] = routingResult.body.tee();
        for await (const chunk of bodyToConsume) {
          response.write(chunk);
        }
        response.end();
        routingResult.body = bodyToReturn;
      }
      return routingResult;
    }
    const preprocessedEvent = routingResult.internalEvent;
    debug("preprocessedEvent", preprocessedEvent);
    const { search, pathname, hash } = new URL(preprocessedEvent.url);
    const reqProps = {
      method: preprocessedEvent.method,
      url: `${pathname}${search}${hash}`,
      //WORKAROUND: We pass this header to the serverless function to mimic a prefetch request which will not trigger revalidation since we handle revalidation differently
      // There is 3 way we can handle revalidation:
      // 1. We could just let the revalidation go as normal, but due to race conditions the revalidation will be unreliable
      // 2. We could alter the lastModified time of our cache to make next believe that the cache is fresh, but this could cause issues with stale data since the cdn will cache the stale data as if it was fresh
      // 3. OUR CHOICE: We could pass a purpose prefetch header to the serverless function to make next believe that the request is a prefetch request and not trigger revalidation (This could potentially break in the future if next changes the behavior of prefetch requests)
      headers: {
        ...headers
      },
      body: preprocessedEvent.body,
      remoteAddress: preprocessedEvent.remoteAddress
    };
    const mergeHeadersPriority = globalThis.openNextConfig.dangerous?.headersAndCookiesPriority ? globalThis.openNextConfig.dangerous.headersAndCookiesPriority(preprocessedEvent) : "middleware";
    const store = globalThis.__openNextAls.getStore();
    if (store) {
      store.mergeHeadersPriority = mergeHeadersPriority;
    }
    const req = new IncomingMessage(reqProps);
    const res = createServerResponse(routingResult, overwrittenResponseHeaders, options?.streamCreator);
    await processRequest(req, res, routingResult);
    const { statusCode, headers: responseHeaders, isBase64Encoded, body } = convertRes(res);
    const internalResult = {
      type: internalEvent.type,
      statusCode,
      headers: responseHeaders,
      body,
      isBase64Encoded
    };
    return internalResult;
  });
}
async function processRequest(req, res, routingResult) {
  delete req.body;
  const initialURL = new URL(
    // We always assume that only the routing layer can set this header.
    routingResult.internalEvent.headers[INTERNAL_HEADER_INITIAL_URL] ?? routingResult.initialURL
  );
  let invokeStatus;
  if (routingResult.internalEvent.rawPath === "/500") {
    invokeStatus = 500;
  } else if (routingResult.internalEvent.rawPath === "/404") {
    invokeStatus = 404;
  }
  const requestMetadata = {
    isNextDataReq: routingResult.internalEvent.query.__nextDataReq === "1",
    initURL: routingResult.initialURL,
    initQuery: convertToQuery(initialURL.search),
    initProtocol: initialURL.protocol,
    defaultLocale: NextConfig.i18n?.defaultLocale,
    locale: routingResult.locale,
    middlewareInvoke: false,
    // By setting invokePath and invokeQuery we can bypass some of the routing logic in Next.js
    invokePath: routingResult.internalEvent.rawPath,
    invokeQuery: routingResult.internalEvent.query,
    // invokeStatus is only used for error pages
    invokeStatus
  };
  try {
    req.url = initialURL.pathname + convertToQueryString(routingResult.internalEvent.query);
    await requestHandler(requestMetadata)(req, res);
  } catch (e) {
    if (e.constructor.name === "NoFallbackError") {
      await handleNoFallbackError(req, res, routingResult, requestMetadata);
    } else {
      error("NextJS request failed.", e);
      await tryRenderError("500", res, routingResult.internalEvent);
    }
  }
}
async function handleNoFallbackError(req, res, routingResult, metadata, index = 1) {
  if (index >= 5) {
    await tryRenderError("500", res, routingResult.internalEvent);
    return;
  }
  if (index >= routingResult.resolvedRoutes.length) {
    await tryRenderError("404", res, routingResult.internalEvent);
    return;
  }
  try {
    await requestHandler({
      ...routingResult,
      invokeOutput: routingResult.resolvedRoutes[index].route,
      ...metadata
    })(req, res);
  } catch (e) {
    if (e.constructor.name === "NoFallbackError") {
      await handleNoFallbackError(req, res, routingResult, metadata, index + 1);
    } else {
      error("NextJS request failed.", e);
      await tryRenderError("500", res, routingResult.internalEvent);
    }
  }
}
async function tryRenderError(type, res, internalEvent) {
  try {
    const _req = new IncomingMessage({
      method: "GET",
      url: `/${type}`,
      headers: internalEvent.headers,
      body: internalEvent.body,
      remoteAddress: internalEvent.remoteAddress
    });
    const requestMetadata = {
      // By setting invokePath and invokeQuery we can bypass some of the routing logic in Next.js
      invokePath: type === "404" ? "/404" : "/500",
      invokeStatus: type === "404" ? 404 : 500,
      middlewareInvoke: false
    };
    await requestHandler(requestMetadata)(_req, res);
  } catch (e) {
    error("NextJS request failed.", e);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      message: "Server failed to respond.",
      details: e
    }, null, 2));
  }
}

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_node(), cloudflare_node_exports));
  return m_1.default;
}
async function resolveTagCache(tagCache) {
  if (typeof tagCache === "function") {
    return tagCache();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveQueue(queue2) {
  if (typeof queue2 === "function") {
    return queue2();
  }
  const m_1 = await Promise.resolve().then(() => (init_direct(), direct_exports));
  return m_1.default;
}
async function resolveIncrementalCache(incrementalCache) {
  if (typeof incrementalCache === "function") {
    return incrementalCache();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy2(), dummy_exports2));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy3(), dummy_exports3));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}
async function resolveCdnInvalidation(cdnInvalidation) {
  if (typeof cdnInvalidation === "function") {
    return cdnInvalidation();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy4(), dummy_exports4));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createMainHandler.js
async function createMainHandler() {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  const thisFunction = globalThis.fnName ? config.functions[globalThis.fnName] : config.default;
  globalThis.serverId = generateUniqueId();
  globalThis.openNextConfig = config;
  await globalThis.__next_route_preloader("start");
  globalThis.queue = await resolveQueue(thisFunction.override?.queue);
  globalThis.incrementalCache = await resolveIncrementalCache(thisFunction.override?.incrementalCache);
  globalThis.tagCache = await resolveTagCache(thisFunction.override?.tagCache);
  if (config.middleware?.external !== true) {
    globalThis.assetResolver = await resolveAssetResolver(globalThis.openNextConfig.middleware?.assetResolver);
  }
  globalThis.proxyExternalRequest = await resolveProxyRequest(thisFunction.override?.proxyExternalRequest);
  globalThis.cdnInvalidationHandler = await resolveCdnInvalidation(thisFunction.override?.cdnInvalidation);
  const converter2 = await resolveConverter(thisFunction.override?.converter);
  const { wrapper, name } = await resolveWrapper(thisFunction.override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(openNextHandler, converter2);
}

// node_modules/@opennextjs/aws/dist/adapters/server-adapter.js
setNodeEnv();
setNextjsServerWorkingDirectory();
globalThis.internalFetch = fetch;
var handler2 = await createMainHandler();
function setNextjsServerWorkingDirectory() {
  process.chdir(__dirname);
}
export {
  handler2 as handler
};
