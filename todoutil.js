class TodoUtil {
  static add(todos, text) {
    return [...todos, {
      id: Date.now() + "_" + (11111 + Math.random() * 88888),
      text: text,
      active: true
    }];
  }

  static remove(todos, id) {
    return todos.filter(t => t.id !== id);
  }

  static toggle(todos, id) {
    return todos.map(t => {
      if (t.id === id) {
        t.active = !t.active;
      }
      return t;
    });
  }
}

module.exports = TodoUtil;