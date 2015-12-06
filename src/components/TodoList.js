import React, { Component, PropTypes } from 'react'
import prefixr from 'react-prefixr'
import {VelocityComponent} from 'velocity-react'
import Todo from './Todo'

export default class TodoList extends Component {

  shouldComponentUpdate(nextProps) {
    const {offsetX} = this.props
    return offsetX !== nextProps.offsetX
  }

  render() {

    const {offsetX, width} = this.props
    const style = prefixr({
      transform: `translateZ(0) translateX(${-1 * offsetX}px)`,
    })

    return (
      <div
        style = {{width}}
        id="wrapper">
        <ul
          style = {style}
          key="container"
          id="container">
          {this.props.todos.map((todo, index) =>
            <Todo
              {...todo}
              width = {width}
              index = {index}
              key={index} />
          )}
        </ul>
      </div>
    )
  }
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  offsetX: PropTypes.number.isRequired,
}
