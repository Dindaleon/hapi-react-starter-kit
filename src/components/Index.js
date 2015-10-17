import React, { Component } from 'react';
import { Link } from 'react-router';
export default class Test extends Component {
  render() {
    return (
			<div>
				This is the index&nbsp;

				<Link to={ '/home' } >Take me home...</Link>
			</div>
		);
  }
}
