import React, { Component, PropTypes } from 'react'
import {VelocityComponent} from 'velocity-react'
import Todo from './Todo'

export default class TodoList extends Component {
  render() {

    const {offSetX} = this.props

    return (
      <div id="wrapper">
        <VelocityComponent animation={{translateX: `${-1 * offSetX}px`}} duration={1}>
          <ul id="container">
            {this.props.todos.map((todo, index) =>
              <Todo {...todo} index = {index} key={index} />
            )}
          </ul>
        </VelocityComponent>
      </div>
    )
  }
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  offSetX: PropTypes.number.isRequired,
}
