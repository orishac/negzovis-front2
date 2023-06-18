import React from 'react';
import Enzyme, { mount } from 'enzyme';
import SelectedNTirpsTable from '../SelectedNTIRPsTable';
import { Card, Table } from 'react-bootstrap';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;


describe('<SelectedNTirpsTable />', () => {
  let wrapper;
  const props = {
    currentLevel: 2,
    currentTirp: { 
        support: 0.5, 
        'mean horizontal support': 0.4, 
        'mean mean duration': 2.3 },
        numOfSymbolInSelctedPath: 4
  };

  beforeEach(() => {
    wrapper = mount(<SelectedNTirpsTable {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render a Card component', () => {
    expect(wrapper.find(Card)).toHaveLength(1);
  });

  it('should render a Table component', () => {
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('should render correct values forMetric', () => {
    expect(wrapper.find('th').at(0).text()).toEqual('Metric');
    expect(wrapper.find('th').at(1).text()).toEqual('Value');
  });

  it('should render correct values for Current Level', () => {
    expect(wrapper.find('th').at(2).text()).toEqual('Current level');
    expect(wrapper.find('td').at(0).text()).toEqual('2');

    const secondProps = {
        currentLevel: 100,
        currentTirp: { 
            support: 0.9, 
            'mean horizontal support': 0.35, 
            'mean mean duration': 4.5 },
            numOfSymbolInSelctedPath: 3
      };
    wrapper = mount(<SelectedNTirpsTable {...secondProps} />);
    expect(wrapper.find('th').at(2).text()).toEqual('Current level');
    expect(wrapper.find('td').at(0).text()).toEqual('100');
  });

  it('should render correct values for Vertical support', () => {
    expect(wrapper.find('th').at(3).text()).toEqual('Vertical support');
    expect(wrapper.find('td').at(1).text()).toEqual('0.5');

    const secondProps = {
        currentLevel: 950,
        currentTirp: { 
            support: 0.0005, 
            'mean horizontal support': 0.35, 
            'mean mean duration': 4.5 },
            numOfSymbolInSelctedPath: 3
      };
    wrapper = mount(<SelectedNTirpsTable {...secondProps} />);
    expect(wrapper.find('th').at(3).text()).toEqual('Vertical support');
    expect(wrapper.find('td').at(1).text()).toEqual('0.0005');
  });

  it('should render correct values for Mean horizontal_support', () => {
    expect(wrapper.find('th').at(4).text()).toEqual('Mean horizontal_support');
    expect(wrapper.find('td').at(2).text()).toEqual('0.400');
  });

  it('should render correct values for Mean mean duration', () => {
    expect(wrapper.find('th').at(5).text()).toEqual('Mean mean duration');
    expect(wrapper.find('td').at(3).text()).toEqual('2.300');
  });

  it('should render correct values for Entities', () => {
    expect(wrapper.find('th').at(6).text()).toEqual('Entities');
    expect(wrapper.find('td').at(4).text()).toEqual(' 4 ');
  });
});
