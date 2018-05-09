const styles = {
  todo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    listStyle: 'none',
    margin: '1rem',
    position: 'relative',

    '&:hover $removeBtn': {
      opacity: 1
    }
  },
  label: {
    padding: `0 2rem`,
    flexGrow: 1,

    '.completed &': {
      textDecoration: 'line-through'
    }
  },
  button: {
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '50%',
    height: '20px',
    width: '20px',
    padding: '0',
    position: 'absolute',
    outline: 'none'
  },
  checkBtn: {
    extend: 'button',
    color: 'lightseagreen',

    '&::before': {
      content: '"✔"',
      opacity: 0
    },
    '.completed &::before': {
      opacity: 1
    }
  },
  removeBtn: {
    extend: 'button',
    borderColor: 'transparent',
    cursor: 'pointer',
    fontSize: '2rem',
    fontWeight: '100',
    marginTop: '-13px',
    opacity: 0,
    right: 0,

    '&::before': {
      content: '"×"'
    }
  }
}

const template = classes => `
<div class="${classes.todo}" o-class="{
  completed: completed
}">
  <button class="${classes.checkBtn}" o-on-click="onCompleteClick()"></button>
  <label class="${classes.label}">{{text}}</label>
  <button class="${classes.removeBtn}" o-on-click="onRemoveClick()"></button>
</div>
`

const Todo = {
  styles,
  template,
  data: {
    id: null,
    completed: false,
    text: ''
  }
}

Todo.onCompleteClick = function () {
  this.completed = !this.completed
  setTimeout(() => {
    this.$emit('complete', this.id, this.completed)
  })
}

Todo.onRemoveClick = function () {
  this.$emit('remove', this.id)
}

export default Todo
