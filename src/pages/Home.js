import React from 'react';
import Helmet from 'react-helmet';
import CounterContainer from '../containers/CounterApp';
import RenderExtension from '../extensions';

export default class Home extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      test: 'Finally,'
    };
  }

  render() {
    const me = 'happy';
    const you = 'happier';
    return (
			<div>
        <Helmet title="Home" />
				{ this.state.test } I am home!
        <div>I am { me }</div>
        <div>You are { you }</div>

        <div>
          <span>So we are </span><span>{ me === 'happy' ? 'good' : 'Bad!' }</span>
        </div>
        ∨ This is a normal counter component using redux ∨
        <CounterContainer />
        ∨ This is an extension counter component using redux ∨
        <RenderExtension name={ 'myCounterExample' } />
        ∨ This is an extension counter component using redux without theme ∨
        <RenderExtension name={ 'counterExtension' } />
			</div>
		);
  }
}
