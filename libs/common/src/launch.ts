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
