import React, { Component, PropTypes } from 'react'
import prefixr from 'react-prefixr'

export default class Todo extends Component {

  shouldComponentUpdate() {
    return false
  }

  render() {
    const {text, index, width} = this.props;
    const style = prefixr({
      width,
      transform: `translateX(${index * width}px)`,
    })
    return (
      <li
        style = {style}
        id={`element${index + 1}`}>
        {text}
      </li>
    )
  }
}

Todo.propTypes = {
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
}
