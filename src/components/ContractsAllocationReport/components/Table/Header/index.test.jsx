import React from 'react';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import Enzyme, {shallow} from 'enzyme';
import * as components from './index.js';

Enzyme.configure({ adapter: new EnzymeAdapter() })

Object.keys(components).forEach((containerName) => {
  const Container = components[containerName];
  describe(`Container: ${containerName}`, () => {
    test(`${containerName} renders with default props`, () => {
      const wrapper = shallow(
        <Container />,
      );
      expect(wrapper).toBeDefined();
    });
  });
});