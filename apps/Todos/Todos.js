import { forEach, reduce } from 'lodash'
import jss from 'jss'

const { classes } = jss.createStyleSheet({
  todos: {
    fontWeight: '200'
  },
  input: {
    fontSize: '1.2rem',
    fontWeight: '200',
    padding: '10px',
    width: '100%'
  },
  list: {
    padding: '0'
  }
}).attach()

const template = `
<article class="${classes.todos}">
  <input
    class="${classes.input}"
    autocomplete="off"
    placeholder="What needs to be done?"
    o-on-keyup="onKeyUp($event)"
  />
  <ul class="${ classes.list }">
    <li o-for="todo in todos"
      is="Todo"
      o-emit-remove="onRemoveTodo"
      o-emit-complete="onToggleCompleteTodo"></li>
  </ul>
</article>
`

const Todos = {
  template,
  data: {
    todos: []
  }
}

Todos.beforeCreate = function () {
  this.data.todos = localStorage.todos
    ? JSON.parse(localStorage.todos)
    : []
}

Todos.onKeyUp = function (event) {
  if (event.key !== 'Enter') {
    return
  }
  const text = event.target.value
  event.target.value = ''
  this.todos.unshift({
    id: randomId().toString(),
    text,
    completed: false
  })
  updateDb(this.todos)
}

Todos.onRemoveTodo = function (id) {
  const index = reduce(this.todos, (pos, todo, index) => {
    return todo.id === id
      ? index
      : pos
  }, -1)
  this.todos.splice(index, 1)
  updateDb(this.todos)
}

Todos.onToggleCompleteTodo = function (id, value) {
  forEach(this.todos, (todo) => {
    if (todo.id === id) {
      todo.completed = value
    }
  })
  updateDb(this.todos)
}

const randomId = () => Math.floor(Math.random() * 10000).toString()

const updateDb = todos => {
  localStorage.todos = JSON.stringify(todos)
}

export default Todos
