import { fromEvent, timer } from 'rxjs'
import { map, mapTo, scan, startWith, switchMap, takeWhile, tap } from 'rxjs/operators'

// utility functions
const takeUntilFunc = (endRange, currentNumber) => {
  return endRange > currentNumber
    ? val => val <= endRange
    : val => val >= endRange
}

const positiveOrNegative = (endRange, currentNumber) => endRange > currentNumber ? 1 : -1

const updateHTML = id => val => (document.getElementById(id).innerHTML = val)

// display
const input = document.getElementById('range')
const updateButton = document.getElementById('update')

const subscription = currentNumber => {
  return fromEvent(updateButton, 'click').pipe(
    map(_ => parseInt(input.value)),
    switchMap(endRange => {
      return timer(0, 20).pipe(
        mapTo(positiveOrNegative(endRange, currentNumber)),
        startWith(currentNumber),
        scan((acc, curr) => acc + curr),
        takeWhile(takeUntilFunc(endRange, currentNumber))
      )
    }),
    tap(v => (currentNumber = v)),
    startWith(currentNumber)
  ).subscribe(updateHTML('display'))
}

subscription(0)
