import React from 'react';
import Layout from '../../src/components/Layout';
import * as utils from '../utils';
import TestUtils from 'react-addons-test-utils';

const noop = () => {};

const testProps = {
  user: {
    coordinates: {
      latitude: '1',
      longitude: '1',
      sessionId: '1'
    }
  },
  children: [],
  dispatch: noop,
  loadLocale: noop,
  login: noop,
  logout: noop,
  pushState: noop,
  router: {},
  setLocale: noop,
  switchLocale: noop
};

describe( 'Components', () => {
  describe( 'Layout', () => {
    const component = utils.shallowlyRenderedOutput( < Layout { ...testProps } / > );

    it( 'should contain one <did> element with id="layout"', () => {
      expect( component.props.id ).to.be.equal( 'layout' );
    });
    it( 'should contain children', () => {
      expect( typeof TestUtils.isElementOfType( component.props.children ) !== 'undefined' ).to.be.true;
    });
  });
});
