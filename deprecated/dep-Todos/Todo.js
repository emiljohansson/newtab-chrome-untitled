const reference = 'Todo'

const styles = {

}

const template = `
<div class="todo">
  <label data-bind="text"></label>
  <button data-on-click="onRemoveClick()">X</button>
  <button data-on-click="onCompleteClick()">✔</button>
</div>
`

// <span data-bind="id"></span> -
// data-bind-class="{
//   completed: completed
// }"

const Todo = {
  reference,
  styles,
  template,
  data: {
    id: null,
    completed: false,
    text: ''
  }
}

Todo.onDataUpdated = function (key) {
}

Todo.attached = function () {
  // this.data.completed.subscribe(() => {
  //   // this.bindings.completed(this.completed)
  //   this.data.completeTodo(this.id, this.completed)
  // })
}

Todo.onCompleteClick = function () {
  this.data.completed(!this.completed)
}

Todo.onRemoveClick = function () {
  this.data.removeTodo(this.id)
}

export default Todo
