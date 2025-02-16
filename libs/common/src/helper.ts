type LaunchFunction = () => any | Promise<any>;
type LaunchClass = { launch: LaunchFunction };

export async function bulkLaunch(
  ...tasks: Array<LaunchFunction | LaunchClass>
) {
  for (const task of tasks) {
    const action = "launch" in task ? task.launch() : task();

    if (action instanceof Promise) {
      await action;
    }
  }
}

export function createSendMethodName<T extends string>(type: T) {
  return "send" + type.charAt(0).toUpperCase() +
    type.slice(1) as `send${Capitalize<T>}`;
}
