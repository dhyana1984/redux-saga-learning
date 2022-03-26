import React, { PropTypes } from 'react'

const Counter = ({ value, onIncrement, onDecrement, onIncrementAsync, onFetchProductAsync, onFetchDE43Async }) =>
  <div>
    <button onClick={onIncrementAsync}>
      Increment after 1 second
    </button>
    {' '}
    <button onClick={onIncrement}>
      Increment
    </button>
    {' '}
    <button onClick={onDecrement}>
      Decrement
    </button>
    {' '}
    <button onClick={onFetchProductAsync}>
      Fetch Product
    </button>
    {' '}
    <button onClick={onFetchDE43Async}>
      Fetch DE43
    </button>
    <hr />
    <div>
      Clicked: {value} times
    </div>
  </div>

Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onIncrementAsync: PropTypes.func.isRequired
}

export default Counter
