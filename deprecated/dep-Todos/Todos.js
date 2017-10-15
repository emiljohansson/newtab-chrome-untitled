const reference = 'Todos'

const styles = {
  weather: {
    fontSize: '2rem'
  }
}

const template = `
<article class="todos">
  <h2>todos</h2>
  <input autocomplete="off"
    placeholder="What needs to be done?"
    data-on-keyup="addTodo"
  />
  <ul>
    <li data-for="todo in todos"
      is="Todo"
      id="{{todo.id}}"
      completed="{{todo.completed}}"
      text="{{todo.text}}"></li>
  </ul>
  <hr />

  <ul>
    <li data-for="todo in todos">{{todo.id}} {{todo.text}}</li>
  </ul>
</article>
`

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'todos':
      return action.value
    case 'add':
      return [
        ...state,
        {
          id: randomId().toString(),
          text: action.text,
          completed: false
        }
      ]
    case 'complete':
      state.forEach(todo => {
        if (todo.id === action.id) {
          todo.completed = !todo.completed
        }
      })
      return state
    case 'remove':
      return state.filter(todo => todo.id !== action.id)
  }
  return state
}

const randomId = () => Math.floor(Math.random() * 10000)

const Todos = {
  reference,
  styles,
  template,
  update: reducer,
  data: {
    todos: localStorage.todos
      ? JSON.parse(localStorage.todos)
      : []
  }
}

Todos.onChildAdded = function (childInstance) {
  this.passData({
    foo: 'bar',
    removeTodo: this.removeTodo.bind(this)
  }, childInstance)
}

Todos.attached = function () {
  this.data.todos.subscribe(() => {
    localStorage.todos = JSON.stringify(this.todos)
  })
  this.passData({
    foo: 'bar',
    completeTodo: this.completeTodo.bind(this),
    removeTodo: this.removeTodo.bind(this)
  })
}

Todos.addTodo = function (event) {
  if (event.key !== 'Enter') {
    return
  }
  const value = event.target.value
  event.target.value = ''
  this.data.todos({
    type: 'add',
    text: value
  })
}

Todos.completeTodo = function (id) {
  this.data.todos({
    type: 'complete',
    id
  })
}

Todos.removeTodo = function (id) {
  this.data.todos({
    type: 'remove',
    id
  })
}

export default Todos
