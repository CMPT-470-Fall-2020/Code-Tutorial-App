/**
 * Class used to represent a queue of messages to be sent to the language server.
 *
 * @class MessageQueue
 */
class MessageQueue {
  /**
   * Creates an instance of Queue.
   * @memberof MessageQueue
   */
  constructor() {
    // Queue containing all messages
    this.msgQueue = [];
    this.queueLen = 0;
  }

  /**
   * Check if the queue is empty.
   *
   * @return {boolean} True or false indicating if the queue is empty.
   * @memberof MessageQueue
   */
  isEmpty() {
    return this.queueLen == 0;
  }

  /**
   * Add a new message to the queue.
   *
   * @param {string} msg Message to be added to the queue.
   * @memberof MessageQueue
   */
  addMessage(msg) {
    this.msgQueue.push(msg);
    this.queueLen += 1;
  }

  /**
   * Get the next message from the queue.
   *
   * @return {string | undefined} Either a string containing the message or undefined if queue is empty.
   * @memberof MessageQueue
   */
  getMessage() {
    if (this.queueLen > 0) {
      let msg = this.msgQueue.shift();
      this.queueLen -= 1;
      return msg;
    }
    return undefined;
  }
}

module.exports.MessageQueue = MessageQueue;
