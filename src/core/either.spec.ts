import { Either, left, right } from './either'

function doSomething(shouldSucess: boolean): Either<string, number> {
  if (shouldSucess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('sucess result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
