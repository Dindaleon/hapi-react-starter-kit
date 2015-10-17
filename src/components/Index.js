import React, { Component } from 'react';
import { Link } from 'react-router';
export default class Index extends Component {
  render() {
    return (
			<div>
				This is the index&nbsp;

				<Link to={ '/home' } ><button>Take me home...</button></Link>
			</div>
		);
  }
}
