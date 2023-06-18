import React from 'react';
import Swal from 'sweetalert2';
import Enzyme from 'enzyme';
import { mount } from 'enzyme';
import NTIRPsTable from '../NTIRPsTable'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import mockData from './mocks/mockData.json'
import 'jest-localstorage-mock';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;

const props = {
  ntable: mockData,
};

const emptyProps = {
  ntable : []
}

// Mock the window.pathOfTirps property
const mockPathOfTirps = {};
Object.defineProperty(window, 'pathOfTirps', {
  value: mockPathOfTirps,
  writable: true,
});

// Mock the NTirpMatrix component
jest.mock('../NTirpMatrix', () => {
  const NTirpMatrixMock = () => <div>NTirpMatrix</div>;
  return NTirpMatrixMock;
});

// Mock the NTIRPTimeLine component
jest.mock('../NTIRPTimeLine', () => {
  const NTIRPTimeLineMock = () => <div>NTIRPTimeLine</div>;
  return NTIRPTimeLineMock;
});

jest.mock('sweetalert2')

const localStorageMock = {
  rootElement: props.ntable,
  negative: 'true',
  VMapFile: {
    8: 'A',
    18: 'B',
  },
  num_of_entities: 0,
  num_of_entities_class_1: 0,
  PassedFromSearch: 'false',
  min_ver_support: 0.5,
};

describe('Component', () => {
  let wrapper;
  beforeAll(() => {
    window.open = jest.fn();
    global.localStorage = localStorageMock;
  });

  beforeEach(() => {
    JSON.parse = jest.fn().mockReturnValueOnce(props.ntable).mockReturnValueOnce(localStorageMock.VMapFile)
    wrapper = mount(<NTIRPsTable {...props}/>);
  });

  it('should render the component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should render the table headers', () => {
    expect(wrapper.find('th').at(0).text()).toEqual('Next');
    expect(wrapper.find('th').at(1).text()).toEqual('P/N');
    expect(wrapper.find('th').at(2).text()).toEqual('Relation');
    expect(wrapper.find('th').at(3).text()).toEqual('Symbol');
    expect(wrapper.find('th').at(4).text()).toEqual('VS0');
    expect(wrapper.find('th').at(5).text()).toEqual('MHS0');
    expect(wrapper.find('th').at(6).text()).toEqual('MMD0');
  });

  it('should render the table rows', () => {
    expect(wrapper.find('td').at(1).text()).toEqual('Positive');
    expect(wrapper.find('td').at(2).text()).toEqual('-');
    expect(wrapper.find('td').at(3).text()).toEqual('A');
    expect(wrapper.find('td').at(4).text()).toEqual('4651');
    expect(wrapper.find('td').at(5).text()).toEqual('2.79');
  });

  it('should render the Selected Table headers', () => {
    expect(wrapper.find('th').at(7).text()).toEqual('Metric');
    expect(wrapper.find('th').at(8).text()).toEqual('Value');
  });

  it('should render the Selected Table rows', () => {
    expect(wrapper.find('th').at(9).text()).toEqual('Current level');
    expect(wrapper.find('th').at(10).text()).toEqual('Vertical support');
    expect(wrapper.find('th').at(11).text()).toEqual('Mean horizontal_support');
    expect(wrapper.find('th').at(12).text()).toEqual('Mean mean duration');
    expect(wrapper.find('th').at(13).text()).toEqual('Entities');
  });

  it('should render the table rows again after next button is pressed', () => {
    expect(wrapper.find('td').at(4).text()).toEqual('4651');
    wrapper.find('td').at(0).find('button').simulate('click')
    expect(wrapper.find('td').at(4).text()).toEqual('4851');
  });

  it('should render the timeline only after row is clicked', () => {
    expect(wrapper.text().includes('NTIRPTimeLine')).toBe(false);
    wrapper.find('td').at(0).find('button').simulate('click')
    expect(wrapper.text().includes('NTIRPTimeLine')).toBe(true);
  });

  it('should render the component with empty props', () => {
    Swal.fire.mockReturnValueOnce("Got Error");
    wrapper = mount(<NTIRPsTable {...emptyProps}/>);
    expect(wrapper.exists()).toBeTruthy();
  });
});
