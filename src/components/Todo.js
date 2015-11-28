import React, { Component, PropTypes } from 'react'

export default class Todo extends Component {

  render() {
    const {text, index} = this.props;
    return (
      <li id={`element${index + 1}`}>{text}</li>
    )
  }
}

Todo.propTypes = {
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
}
