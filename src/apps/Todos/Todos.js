import { forEach, reduce } from 'lodash'
import extendWindowApp from 'apps/WindowApp'

const baseStyle = {
  boxSizing: 'border-box',
  fontFamily: `'Montserrat', sans-serif`
}

const styles = {
  '@global :host': {
    extend: baseStyle,
    fontWeight: '200',
    padding: '0.5rem 1rem'
  },
  header: {
    fontSize: '1.6rem',
    margin: '1rem',
    textAlign: 'center'
  },
  input: {
    extend: baseStyle,
    border: '1px solid #e2e2e2',
    borderRadius: '50px',
    fontSize: '0.8rem',
    margin: '1rem',
    padding: '0.5rem 1rem',
    width: '100%'
  },
  list: {
    extend: baseStyle,
    padding: '0'
  }
}

const template = classes => `
<template>
  <header>
    <h1 class="${classes.header}">todo</h1>
  </header>
  <input
    class="${classes.input}"
    autocomplete="off"
    placeholder="What needs to be done?"
    o-on-keyup="onKeyUp($event)"
  />
  <div class="${classes.list}">
    <div o-for="todo in todos"
      is="Todo"
      o-emit-remove="onRemoveTodo"
      o-emit-complete="onToggleCompleteTodo"></div>
  </div>
</template>
`

const Todos = extendWindowApp('Todos', {
  useShadow: true,
  styles,
  template,
  data: {
    todos: []
  },
  windowSettings: {
    background: 'white'
  }
})

Todos.beforeCreate = function () {
  this.data.todos = window.localStorage.todos
    ? JSON.parse(window.localStorage.todos)
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
  window.localStorage.todos = JSON.stringify(todos)
}

export default Todos
