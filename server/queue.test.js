const { MessageQueue } = require("./message_queue");

test("empty queue is empty", () => {
  let m = new MessageQueue();
  expect(m.isEmpty()).toBe(true);
});

test("empty queue returns undefined", () => {
  let m = new MessageQueue();
  expect(m.isEmpty()).toBe(true);
  expect(m.getMessage()).toEqual(undefined);
});

test("non-empty queue is not empty", () => {
  let m = new MessageQueue();
  m.addMessage("Hello");
  expect(m.isEmpty()).toBe(false);
});

test("add one message and retrieve", () => {
  let m = new MessageQueue();
  m.addMessage("Hello");
  expect(m.getMessage()).toEqual("Hello");
});

test("add two messages and retrieve first", () => {
  let m = new MessageQueue();
  m.addMessage("Hello");
  m.addMessage("World");
  expect(m.getMessage()).toEqual("Hello");
});

test("add two messages and retrieve all", () => {
  let m = new MessageQueue();
  m.addMessage("Hello");
  m.addMessage("World");
  expect(m.getMessage()).toEqual("Hello");
  expect(m.getMessage()).toEqual("World");
});

test("add two messages, retrieve one and check empty status", () => {
  let m = new MessageQueue();
  m.addMessage("Hello");
  m.addMessage("World");
  expect(m.getMessage()).toEqual("Hello");
  expect(m.isEmpty()).toBe(false);
});

test("add two messages, retrieve all and check empty status", () => {
  let m = new MessageQueue();
  m.addMessage("Hello");
  m.addMessage("World");
  expect(m.getMessage()).toEqual("Hello");
  expect(m.getMessage()).toEqual("World");
  expect(m.isEmpty()).toBe(true);
});
