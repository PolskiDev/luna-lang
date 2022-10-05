export let windows = process.platform == "win32";
export let darwin = process.platform == "darwin";
export let linux = process.platform == "linux";

export let freebsd = process.platform == "freebsd";
export let openbsd = process.platform == "openbsd";
export let solaris = process.platform == "sunos";

export let libs_path_win32 = `%username%\\xlang-dev\\`
export let libs_path_darwin = `/opt/xlang-dev`
export let libs_path_linux = `/opt/xlang-dev`
export let libs_path_freebsd = `/opt/xlang-dev`
export let libs_path_openbsd = `/opt/xlang-dev`
export let libs_path_solaris = `/opt/xlang-dev`
export let libs = ['string.js','os_env.js','array.js']