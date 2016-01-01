import React from 'react';
import Index from '../../src/components/Index';
import * as utils from '../utils';

describe( 'Components', () => {
  describe( 'Index', () => {
    const component = utils.shallowlyRenderedOutput( < Index / > );

    it( 'should contain one "<div>" element', () => {
      expect( component.type ).to.be.equal( 'div' );
    });

    it( 'should contain one "<Link>" element that takes you home', () => {
      expect( component.props.children[1].props.to ).to.be.equal( '/home' );
    });
  });
});
