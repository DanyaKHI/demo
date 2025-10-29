export const logEnv = () => {
  console.groupCollapsed("process.env");
  Object.entries(import.meta.env).forEach(([key, value]) => {
    console.log(`${key} = ${value}`);
  });
  console.groupEnd();
};
