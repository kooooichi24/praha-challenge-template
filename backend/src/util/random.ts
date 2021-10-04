import { uuid } from 'uuidv4'

export const createRandomIdString = () => {
  return uuid()
}

export const createRandomAlphabetChar = (): string => {
  // 生成する文字列に含める文字セット
  const c = 'abcdefghijklmnopqrstuvwxyz'

  return c[Math.floor(Math.random() * c.length)]!
}
