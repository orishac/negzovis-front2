import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { Redirect, BrowserRouter  } from 'react-router-dom';
import NSearchMeanPresentation from '../NSearchMeanPresentation';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;


describe('NSearchMeanPresentation component', () => {
  const props = {
    tirp: {
      elements: [[1], [2], [3]],
      support: 0.5,
      'mean horizontal support': 0.4,
      'mean mean duration': 0.3,
    },
    vs: 0.2,
    canExplore: true,
  };

  it('should render the component without errors', () => {
    const wrapper = mount(<NSearchMeanPresentation {...props} />);
    expect(wrapper.find('Card')).toHaveLength(1);
  });

  it('should render the Tirp info', () => {
    const wrapper = mount(<NSearchMeanPresentation {...props} />);
    expect(wrapper.find('th')).toHaveLength(6);
    expect(wrapper.find('td')).toHaveLength(4);
  });

  // it('should redirect to the NegativeTirps page when Explore TIRP button is clicked', () => {
  //   const wrapper = mount(<NSearchMeanPresentation {...props} />);
  //   wrapper.find('button').simulate('click');
  //   expect(wrapper.find(Redirect)).toHaveLength(1);
  //   expect(wrapper.find(Redirect).props().to).toBe('/TirpsApp/NegativeTirps');
  // });
});
