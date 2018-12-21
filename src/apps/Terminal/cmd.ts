import { fileSystem } from '../OS'

let currentDir: string = '/'

export const cd = path => {
  const isRootPath = path[0] === '/'
  const newPath = isRootPath
    ? path
    : `${currentDir}/${path}`.replace(new RegExp('//', 'g'), '/')
  if (fileSystem.getDir(newPath) != null) {
    currentDir = newPath
    return ''
  }
  return `cd: no such file or directory: ${path}`
}

export const date = () => new Date()

export const ls = () => {
  const dir: any = fileSystem.getDir(pwd())
  return Object.keys(dir)
}

export const pwd = () => currentDir
