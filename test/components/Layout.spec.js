import React from 'react';
import Layout from '../../src/components/Layout';
import * as utils from '../utils';
import TestUtils from 'react-addons-test-utils';

describe( 'Components', () => {
  describe( 'Layout', () => {
    const component = utils.shallowlyRenderedOutput( < Layout / > );

    it( 'should contain one <did> element with id="layout"', () => {
      expect( component.props.id ).to.be.equal( 'layout' );
    });
    it( 'should contain children', () => {
      expect( typeof TestUtils.isElementOfType( component.props.children ) !== 'undefined' ).to.be.true;
    });
  });
});
