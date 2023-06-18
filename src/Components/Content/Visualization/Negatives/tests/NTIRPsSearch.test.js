import React from 'react';
import Enzyme, { mount } from 'enzyme';
import NTIRPsSearch from '../NTIRPsSearch';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});
global.window = dom.window;
global.document = dom.window.document;

const props = {
    ntable: [{"durations":[1.0,15.381336127261717],"elements":[[8],[8]],"gaps":[0.0],"mean horizontal support":2.794022790797678,"mean mean duration":16.381336127261733,"negatives":[false,true],"support":4651},
    {"durations":[1.0,10.719659081750578],"elements":[[8],[18]],"gaps":[0.0],"mean horizontal support":2.7938077832724146,"mean mean duration":11.719659081750569,"negatives":[false,true],"support":4651},
    {"durations":[1.0],"elements":[[8]],"gaps":[],"mean horizontal support":2.794022790797678,"mean mean duration":1.0,"negatives":[false],"support":4651},
    {"durations":[1.0,16.065497515127483],"elements":[[18],[18]],"gaps":[0.0],"mean horizontal support":2.1912580943570767,"mean mean duration":17.065497515127486,"negatives":[false,true],"support":4324},
    {"durations":[1.0],"elements":[[18]],"gaps":[],"mean horizontal support":2.192094313453537,"mean mean duration":1.0,"negatives":[false],"support":4326},
    {"durations":[5.648990156899009,1.0,15.409204292381236],"elements":[[18],[8],[8]],"gaps":[0.0,0.0],"mean horizontal support":2.38248436103664,"mean mean duration":22.058194449280204,"negatives":[true,false,true],"support":4476},
    {"durations":[5.647649674325282,1.0,10.224972589097929],"elements":[[18],[8],[18]],"gaps":[0.0,0.0],"mean horizontal support":2.382260947274352,"mean mean duration":16.87262226342322,"negatives":[true,false,true],"support":4476},
    {"durations":[5.648990156899009,1.0],"elements":[[18],[8]],"gaps":[0.0],"mean horizontal support":2.38248436103664,"mean mean duration":6.648990156899009,"negatives":[true,false],"support":4476},
    {"durations":[2.66390407],"elements":[[18]],"gaps":[],"mean horizontal support":2.5339389784024684,"mean mean duration":2.66390407,"negatives":[true],"support":5834},
    {"durations":[3.2364430798851314,1.0,16.0646683449945],"elements":[[8],[18],[18]],"gaps":[0.0,0.0],"mean horizontal support":2.1908396946564888,"mean mean duration":20.30111142487965,"negatives":[true,false,true],"support":4323},
    {"durations":[3.23989443568634,1.0],"elements":[[8],[18]],"gaps":[0.0],"mean horizontal support":2.1916763005780346,"mean mean duration":4.239894435686342,"negatives":[true,false],"support":4325},
    {"durations":[2.27890518],"elements":[[8]],"gaps":[],"mean horizontal support":3.115872471717518,"mean mean duration":2.27890518,"negatives":[true],"support":5834}],
};

const localStorageMock = {
    rootElement: {},
    negative: 'true',
    VMapFile: {
      1: 'A',
      2: 'B',
      3: 'C',
      4: 'D',
    },
    min_ver_support: 0.5,
};

jest.mock('../NSearchMeanPresentation', () => {
    const NSearchMeanPresentationMock = () => <div>NSearchMeanPresentationMock</div>;
    return NSearchMeanPresentationMock;
});
  
jest.mock('../NTIRPTimeLine', () => {
    const NTIRPTimeLineMock = () => <div>NTIRPTimeLineMock</div>;
    return NTIRPTimeLineMock;
});
  
jest.mock('../NSearchTable', () => {
    const NSearchTableMock = () => <div>NSearchTableMock</div>;
    return NSearchTableMock;
});
  
jest.mock('../NSearchIntervals', () => {
    const NSearchIntervalsMock = () => <div>NSearchIntervalsMock</div>;
    return NSearchIntervalsMock;
});
  
jest.mock('../SearchNLimits', () => {
    const SearchNLimitsMock = () => <div>SearchNLimitsMock</div>;
    return SearchNLimitsMock;
});

jest.mock('../NSearchGraph', () => {
    const NSearchGraphMock = () => <div>NSearchGraphMock</div>;
    return NSearchGraphMock;
});


describe('NTIRPsSearch', () => {
  let wrapper;

  beforeAll(() => {
    global.localStorage = localStorageMock;
  });

  beforeEach(() => {
    JSON.parse = jest.fn().mockReturnValueOnce(props.ntable).mockReturnValueOnce(localStorageMock.VMapFile)
    wrapper = mount(<NTIRPsSearch />);
  });


  it('should render the component', () => {
    expect(wrapper.exists()).toBeTruthy();
  });


it('initializes state correctly', () => {
    expect(wrapper.state('showGraph')).toBe(true);
    expect(wrapper.state('canExplore')).toBe(false);
    expect(wrapper.state('searchResults')).toEqual([]);
    expect(wrapper.state('outputAlgoritm')).toEqual(props.ntable);
    expect(wrapper.state('vnames')).toEqual(localStorageMock.VMapFile);
    expect(wrapper.state('startNList')).toEqual([]);
    expect(wrapper.state('containNList')).toEqual([]);
    expect(wrapper.state('endNList')).toEqual([]);
    expect(wrapper.state('NmeasureToRate')).toEqual({
      vs0: 2,
      mhs0: 2,
      size: 2,
    });
    expect(wrapper.state('Nparameters')).toEqual({
      minSizeCls0: 1,
      maxSizeCls0: 10,
      minHSCls0: 1,
      maxHSCls0: 100,
      minVSCls0: 1,
      maxVSCls0: 100,
    });
    expect(wrapper.state('NSelected')).toEqual([]);
});

/// Need To Add Functionality
it('renders the NSearchGraph component', () => {
  expect(wrapper.text()).toContain('NSearchGraphMock');
  expect(wrapper.text()).not.toContain('NSearchTableMock');

  wrapper.setState({ showGraph: false})
  expect(wrapper.text()).not.toContain('NSearchGraphMock');
  expect(wrapper.text()).toContain('NSearchTableMock');
});

/// Need To Add Functionality
it('renders the NSearchMeanPresentation component', () => {
  expect(wrapper.text()).not.toContain('NSearchMeanPresentationMock');
  wrapper.setState({ NSelected: props.ntable[0]})
  expect(wrapper.text()).toContain('NSearchMeanPresentationMock');
});

/// Need To Add Functionality
it('renders the NTIRPTimeLine component', () => {
  expect(wrapper.text()).not.toContain('NTIRPTimeLineMock');
  wrapper.setState({ NSelected: props.ntable[0]})
  expect(wrapper.text()).toContain('NTIRPTimeLineMock');
});

it('renders the NSearchIntervals component', () => {
  expect(wrapper.text()).toContain('NSearchIntervalsMock');
});
});
