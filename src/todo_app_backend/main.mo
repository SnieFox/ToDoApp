import Array "mo:base/Array";

actor {
  type Task = {
    id: Nat;
    text: Text;
    completed: Bool;
  };

  stable var tasks: [Task] = [];
  stable var nextId: Nat = 0;

  public func addTask(text: Text) : async Nat {
    let id = nextId;
    nextId := nextId + 1;
    let task = { id = id; text = text; completed = false };
    tasks := Array.append(tasks, [task]);
    id
  };

  public query func getTasks() : async [Task] {
    tasks
  };

  public func toggleTask(id: Nat) : async Bool {
    var found = false;
    tasks := Array.map<Task, Task>(tasks, func (t) {
      if (t.id == id) {
        found := true;
        { id = t.id; text = t.text; completed = not t.completed }
      } else {
        t
      }
    });
    found
  };

  public func deleteTask(id: Nat) : async Bool {
    let originalLength = tasks.size();
    tasks := Array.filter<Task>(tasks, func (t) { t.id != id });
    tasks.size() != originalLength
  };
};