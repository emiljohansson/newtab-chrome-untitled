import * as spacing from 'style/spacing'

const styles = {
  '@global :host': {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    fontSize: '0.8rem',
    height: '20px',
    padding: `0 ${spacing.space.m}`
  },
  col: {
    flex: '1',
    '& > *': {
      display: 'inline-block'
    }
  },
  leftCol: {
    extend: 'col'
  },
  rightCol: {
    extend: 'col',
    textAlign: 'right'
  },
  appMenu: {
  }
}

const template = classes => `
<template>
  <div class="${classes.leftCol}">
    <div class="${classes.appMenu}"
     o-on-click="onAppMenuClick()">
      <i class="fas fa-bars"></i>
    </div>
  </div>
  <div class="${classes.rightCol}">
    <div is="Weather"></div>
    <div is="Time" timezone="America/Denver"></div>
  </div>
  <link rel="stylesheet" href="vendor/css/fontawesome-all.min.css">
</template>
`

const StatusBar = {
  useShadow: true,
  styles,
  template,
  data: {
    isActive: true
  }
}

StatusBar.mounted = function () {}

StatusBar.onAppMenuClick = function () {
  console.log('click')
}

export default StatusBar
