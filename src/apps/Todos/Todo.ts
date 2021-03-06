const buttonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #ccc',
  borderRadius: '50%',
  height: '20px',
  width: '20px',
  padding: '0',
  position: 'absolute',
  outline: 'none'
}

const styles = {
  todo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    listStyle: 'none',
    margin: '0 0 1rem 0',
    position: 'relative',

    '&:hover .removeBtn': {
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
  checkBtn: {
    extend: buttonStyle,
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
    extend: buttonStyle,
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

const template = `
<div class="todo" o-class="{
  completed: completed
}">
  <button class="checkBtn" o-on-click="onCompleteClick()"></button>
  <label class="label">{{text}}</label>
  <button class="removeBtn" o-on-click="onRemoveClick()"></button>
</div>
`

const Todo: any = {
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
