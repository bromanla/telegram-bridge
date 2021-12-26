// TODO: Fix
class Queue {
  private queue: Array<(() => Promise<void>)> = [];

  public push(fun: () => Promise<void>) {
    this.queue.push(fun);

    if (this.queue.length === 1) this.next();
  }

  private async next() {
    if (this.queue.length === 0) return;

    const fun = this.queue[0];
    if (fun) {
      await fun();
      this.queue.shift();
      await this.next();
    }
  }
}

export default Queue;
