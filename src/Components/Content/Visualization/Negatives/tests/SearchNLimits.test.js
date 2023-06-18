import React from 'react';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import SearchNLimits from '../SearchNLimits';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;

describe('<SearchNLimits />', () => {
  const changeParameterMock = jest.fn();
  const changeMeasureToRateMock = jest.fn();
  const props = {
    parameters: {
      maxVSCls0: 0,
      maxHSCls0: 0,
      maxSizeCls0: 0,
      minVSCls0: 0,
      minHSCls0: 0,
      minSizeCls0: 0,
    },
    NmeasureToRate: {},
    changeParameter: changeParameterMock,
    changeMeasureToRate: changeMeasureToRateMock,
  };

  const localStorageMock = {
    min_ver_support: 40
  };

  let wrapper;
  beforeEach(() => {
    global.localStorage = localStorageMock;
    wrapper = mount(<SearchNLimits {...props} />);
  });

  it('should render a CDropdown component', () => {
    expect(wrapper.find('CDropdown')).toHaveLength(3);
  });

  it('should render six input fields with type "number"', () => {
    expect(wrapper.find('input[type="number"]')).toHaveLength(6);
  });

  it('should call "changeParameter" when an input field value changes', () => {
    const input = wrapper.find('input').first();
    input.simulate('change', { target: { value: '10' } });
    expect(changeParameterMock).toHaveBeenCalledTimes(1);
  });

  it('should call "changeMeasureToRate" when a CDropdownItem is clicked', () => {
    const dropdownItem = wrapper.find('CDropdownItem').first();
    dropdownItem.simulate('click');
    expect(changeMeasureToRateMock).toHaveBeenCalledTimes(1);
  });
});
