// Stub for kernelsu module during build process
// In the actual KernelSU environment, this will be replaced by the real kernelsu API

export function exec(command) {
  // This is a stub implementation for build time
  // The real exec function will be available in KernelSU runtime
  console.warn('kernelsu.exec() called in build environment - this is a stub');
  return Promise.resolve({ code: 0, stdout: '', stderr: '' });
}

export default {
  exec
};