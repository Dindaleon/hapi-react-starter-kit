import React, { Component } from 'react';
import { Link } from 'react-router';
export default class Index extends Component {
  render() {
    return (
			<div>
				<div>This is the index</div>

				<Link to={ '/home' } ><button>Take me home...</button></Link>
			</div>
		);
  }
}
