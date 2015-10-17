import React from 'react';

export default class Home extends React.Component {
  constructor( props ) {
    super( props );
    this.state = { test: 'Finally,' };
  }
  render() {
    return (
			<div>
				{ this.state.test } I am home!
			</div>
		);
  }
}
