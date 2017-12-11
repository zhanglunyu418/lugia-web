/**
 *
 * create by ligx
 *
 * @flow
 */
import React from 'react';
import chai from 'chai';
import 'jest-styled-components';
import Enzyme, { mount, shallow, } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Tree from '../';
import { createTestComponent, } from 'sv-test-utils';
import renderer from 'react-test-renderer';
import * as Widget from '../../consts/Widget';

Enzyme.configure({ adapter: new Adapter(), });

const { expect: exp, } = chai;
const { mockFunction, mockObject, VerifyOrder, VerifyOrderConfig, } = require('vx-mock');
const rowData = [
  { key: '1', title: '1', },
  { key: '1.1', title: '1.1', pid: '1', path: '1', isLeaf: true, },
  { key: '1.2', title: '1.2', pid: '1', path: '1', },
  { key: '1.2.1', title: '1.2.1', pid: '1.2', path: '1/1.2', isLeaf: true, },
  { key: '1.2.2', title: '1.2.2', pid: '1.2', path: '1/1.2', },
  { key: '1.2.2.1', title: '1.2.2.1', pid: '1.2.2', path: '1/1.2/1.2.2', },
  { key: '1.2.2.1.1', title: '1.2.2.1.1', pid: '1.2.2.1', path: '1/1.2/1.2.2/1.2.2.1', isLeaf: true, },
  { key: '1.2.2.1.2', title: '1.2.2.1.2', pid: '1.2.2.1', path: '1/1.2/1.2.2/1.2.2.1', isLeaf: true, },
  { key: '1.2.2.2', title: '1.2.2.2', pid: '1.2.2', path: '1/1.2/1.2.2', isLeaf: true, },

  { key: '1.3', title: '1.3', pid: '1', path: '1', },
  { key: '1.3.1', title: '1.3.1', pid: '1.3', path: '1/1.3', },
  { key: '1.3.1.1', title: '1.3.1.1', pid: '1.3.1', path: '1/1.3/1.3.1', isLeaf: true, },
  { key: '1.3.1.2', title: '1.3.1.2', pid: '1.3.1', path: '1/1.3/1.3.1', isLeaf: true, },
  { key: '1.3.2', title: '1.3.2', pid: '1.3', path: '1/1.3', },
  { key: '1.3.2.1', title: '1.3.2.1', pid: '1.3.2', path: '1/1.3/1.3.2', isLeaf: true, },
  { key: '1.3.2.2', title: '1.3.2.2', pid: '1.3.2', path: '1/1.3/1.3.2', isLeaf: true, },
  { key: '1.3.3', title: '1.3.3', pid: '1.3', path: '1/1.3', isLeaf: true, },

  { key: '2', title: '2', },
  { key: '2.1', title: '2.1', pid: '2', path: '2', },
  { key: '2.1.1', title: '2.1.1', pid: '2.1', path: '2/2.1', isLeaf: true, },
  { key: '2.1.2', title: '2.1.2', pid: '2.1', path: '2/2.1', },
  { key: '2.1.2.1', title: '2.1.2.1', pid: '2.1.2', path: '2/2.1/2.1.2', isLeaf: true, },
  { key: '2.2', title: '2.2', pid: '2', path: '2', },
  { key: '2.2.1', title: '2.2.1', pid: '2.2', path: '2/2.2', },
  { key: '2.2.1.1', title: '2.2.1.1', pid: '2.2.1', path: '2/2.2/2.2.1', isLeaf: true, },
  { key: '2.2.1.2', title: '2.2.1.2', pid: '2.2.1', path: '2/2.2/2.2.1', isLeaf: true, },
  { key: '2.2.2', title: '2.2.2', pid: '2.2', path: '2/2.2', isLeaf: true, },

  { key: '3', title: '3', },
  { key: '3.1', title: '3.1', pid: '3', path: '3', isLeaf: true, },
  { key: '3.2', title: '3.2', pid: '3', path: '3', isLeaf: true, },
  { key: '4', title: '4', isLeaf: true, },
];
const HalfChecked = 'sv-tree-checkbox-indeterminate';
const Checked = 'sv-tree-checkbox-checked';
const Selected = 'sv-tree-node-selected';
const CheckBox = '.sv-tree-checkbox';
const CheckBoxInner = '.sv-tree-checkbox-inner';
const TreeRow = '.sv-tree-node-content-wrapper';
describe('Tree', () => {
  let order;
  beforeEach(() => {
    order = VerifyOrder.create();
  });

  class ExpandAllTree extends React.Component<Object, Object> {
    render () {
      return <Tree
        key="tree"
        expandAll
        {...this.props}
      >
      </Tree>;
    }
  }

  it('props: query: 2.1.2.1 expandAll: true mutliple: false', () => {
    const Target = <Tree
      expandAll
      showLine
      query="2.1.2.1"
      data={rowData}
    >
    </Tree>;
    const cmp = mount(Target);
    expect(renderer.create(Target).toJSON()).toMatchSnapshot();
    const titles = cmp.find('.sv-tree-title');
    exp(titles.length).to.be.equal(4);
    exp(titles.at(0).text()).to.be.equal('2');
    exp(titles.at(1).text()).to.be.equal('2.1');
    exp(titles.at(2).text()).to.be.equal('2.1.2');
    exp(titles.slice(3, 4).text()).to.be.equal('2.1.2.1');
  });

  it('props: query: 2.1.2.1 expandAll: false mutliple: true', () => {
    const cmp = mount(<Tree
      expandAll
      mutliple
      showLine
      data={rowData}
    >
    </Tree>);
  });


  it('props: defaultValue: 1 mutliple: true onChange监听', async () => {

    class LimitTree extends React.Component<Object, Object> {
      render () {
        return <Tree
          expandAll
          {...this.props}
        >
        </Tree>;
      }

    }

    let onChange;
    const res = new Promise(resolve => {
      const values = [];
      onChange = v => {
        values.push(v);
        if (values.length === 2) {
          resolve(values);
        }
      };
    });

    const Target = <LimitTree defaultValue="1" data={rowData} mutliple onChange={onChange}/>;
    const cmp = mount(Target);
    expect(renderer.create(Target).toJSON()).toMatchSnapshot();
    const chkBox = cmp.find(CheckBoxInner);
    chkBox.at(1).simulate('click', {});
    chkBox.at(1).simulate('click', {});
    chkBox.at(3).simulate('click', {});
    const result = await res;
    exp(result).to.be.eql([['1', '1.1',], ['1',], ['1', '1.2.1',],]);
  });

  it('props: value: 1 mutliple: true onChange监听 limit', async () => {

    class LimitTree extends React.Component<Object, Object> {
      render () {
        return <Tree
          value={'1'}
          expandAll
          {...this.props}
        >
        </Tree>;
      }

    }

    let onChange;
    const res = new Promise(resolve => {
      const values = [];
      onChange = v => {
        values.push(v);
        if (values.length === 2) {
          resolve(values);
        }
      };
    });

    const Target = <LimitTree defaultValue="2" data={rowData} mutliple onChange={onChange}/>;
    const cmp = mount(Target);
    expect(renderer.create(Target).toJSON()).toMatchSnapshot();

    const chkBox = cmp.find(CheckBoxInner);
    chkBox.at(1).simulate('click', {});
    chkBox.at(1).simulate('click', {});
    chkBox.at(3).simulate('click', {});
    const result = await res;
    cmp.find(CheckBox);
    exp(result).to.be.eql([['1', '1.1',], ['1',], ['1', '1.2.1',],]);
  });


  it('props: defaultValue: 1,1.1,1.2  mutliple: false', () => {

    let cmp = mount(<ExpandAllTree data={rowData} defaultValue={'1,1.1,1.2'}/>);
    exp(cmp.find('.' + Selected).length).to.be.equal(0);
    cmp = mount(<ExpandAllTree data={rowData} defaultValue={'1,1.1,1.2'.split(',')}/>);
    exp(cmp.find(TreeRow).at(0).hasClass(Selected)).to.be.true;
    exp(cmp.find('.' + Selected).length).to.be.equal(1);
  });

  it('props: value 1  mutliple: false', () => {

    const cmp = mount(<ExpandAllTree data={rowData} value="1"/>);
    const chkBoxes = cmp.find(TreeRow);
    exp(cmp.find('.' + Selected).length).to.be.equal(1);
    exp(chkBoxes.at(0).hasClass(Selected)).to.be.true;
    exp(chkBoxes.at(1).hasClass(Selected)).to.be.false;
    exp(chkBoxes.at(2).hasClass(Selected)).to.be.false;
  });

  it('props: defaultValue: 1,1.1,1.2 & value 1  mutliple: false', () => {

    const cmp = mount(<ExpandAllTree data={rowData} defaultValue={'1'} value={'1.2'}/>);
    const chkBoxes = cmp.find(TreeRow);
    exp(cmp.find('.' + Selected).length).to.be.equal(1);
    exp(chkBoxes.at(2).hasClass(Selected)).to.be.true;
  });


  it('props: defaultValue: 1 mutliple: false onChange监听', async () => {

    class LimitTree extends React.Component<Object, Object> {
      render () {
        return <Tree
          expandAll
          {...this.props}
        >
        </Tree>;
      }

    }

    let onChange;
    const res = new Promise(resolve => {
      const values = [];
      onChange = v => {
        values.push(v);
        if (values.length === 2) {
          resolve(values);
        }
      };
    });

    const cmp = mount(<LimitTree defaultValue="1" data={rowData} mutliple={false} onChange={onChange}/>);
    const getChkBox = () => cmp.find(TreeRow);

    getChkBox().at(1).simulate('click', {});

    cmp.update();
    exp(cmp.find(TreeRow).at(1).hasClass(Selected)).to.be.true;
    getChkBox().at(1).simulate('click', {});
    getChkBox().at(3).simulate('click', {});

    cmp.update();

    const result = await res;
    exp(cmp.find('.' + Selected).length).to.be.equal(1);
    exp(result).to.be.eql([['1.1',], ['',], ['1.2.1',],]);
  });

  it('props: value: 1 mutliple: false onChange监听 limit', async () => {

    class LimitTree extends React.Component<Object, Object> {
      constructor (props) {
        super(props);
        const { value, } = props;
        this.state = { value, };
      }

      render () {
        const { value, } = this.state;
        return [<Tree
          value={value}
          expandAll
          {...this.props}
        >
        </Tree>, <button onClick={this.onClick}></button>,];
      }

      onClick = () => {
        this.setState({ value: '1.1', });
      }
    }

    let onChange;
    const res = new Promise(resolve => {
      const values = [];
      onChange = v => {
        values.push(v);
        if (values.length === 2) {
          resolve(values);
        }
      };
    });

    const Target = <LimitTree value="1" data={rowData} onChange={onChange}/>;
    const cmp = mount(Target);
    expect(renderer.create(Target).toJSON()).toMatchSnapshot();

    const getChkBox = () => cmp.find(TreeRow);

    function checkSelectStatus () {
      exp(getChkBox().at(0).hasClass(Selected)).to.be.true;
      exp(getChkBox().at(1).hasClass(Selected)).to.be.false;
      exp(getChkBox().at(3).hasClass(Selected)).to.be.false;
    }

    getChkBox().at(1).simulate('click', {});
    checkSelectStatus();
    getChkBox().at(1).simulate('click', {});
    checkSelectStatus();
    getChkBox().at(3).simulate('click', {});
    checkSelectStatus();
    const result = await res;
    cmp.find(CheckBox);
    exp(result).to.be.eql([['1.1',], ['1.1',], ['1.2.1',],]);
  });


  it('props: value: 1 mutliple: false 重新设置value属性', () => {


    class Target extends React.Component<Object, Object> {
      constructor (props) {
        super(props);
        const { value, } = props;
        this.state = { value, };
      }

      render () {
        const { value, } = this.state;
        return [<Tree data={rowData}
                       expandAll
                       value={value}
        >
        </Tree>, <button onClick={this.onClick}></button>,];
      }

      onClick = () => {
        this.setState({ value: '1.1', });
      }
    }

    const cmp = mount(<Target value="1"/>);

    exp(cmp.find(TreeRow).at(0).hasClass(Selected)).to.be.true;
    exp(cmp.find(`.${Selected}`).length).to.be.equal(1);
    cmp.find('button').simulate('click');

    exp(cmp.find(`.${Selected}`).length).to.be.equal(1);
    exp(cmp.find(TreeRow).at(0).hasClass(Selected)).to.be.false;
    exp(cmp.find(TreeRow).at(1).hasClass(Selected)).to.be.true;

  });


  it('mutliple: false change props.value ', () => {

    const cmp = mount(<Tree expandAll data={rowData}/>);
    exp(cmp.find(`.${Selected}`).length).to.be.equal(0);
    cmp.setProps({ value: '1', });

    cmp.update();
    exp(cmp.find(`.${Selected}`).length).to.be.equal(1);

    cmp.setProps({ value: '1.1', });

    cmp.update();
    exp(cmp.find(`.${Selected}`).length).to.be.equal(1);

  });

  it('mutliple: false change props.value 1 => ""  ', () => {
    createSinglePropsValueEmptyCase('');
  });

  it('mutliple: false change props.value 1 => undefined  ', () => {
    createSinglePropsValueEmptyCase(undefined);
  });


  function createSinglePropsValueEmptyCase (emptyValue: any) {
    const cmp = mount(<Tree expandAll data={rowData}/>);
    exp(cmp.find(`.${Selected}`).length).to.be.equal(0);
    cmp.setProps({ value: '1', });

    cmp.update();
    exp(cmp.find(`.${Selected}`).length).to.be.equal(1);

    cmp.setProps({ value: emptyValue, });

    cmp.update();
    exp(cmp.find(`.${Selected}`).length).to.be.equal(0);
  }


  it('mutliple: true change props.value 1 => ""  ', () => {
    createMutlipePropsValueEmptyCase('');
  });

  it('mutliple: true change props.value 1 => undefined  ', () => {
    createMutlipePropsValueEmptyCase(undefined);
  });


  function createMutlipePropsValueEmptyCase (emptyValue: any) {
    const cmp = mount(<Tree mutliple={true} expandAll data={rowData}/>);
    exp(cmp.find(`.${Selected}`).length).to.be.equal(0);
    cmp.setProps({ value: '1', });

    cmp.update();
    exp(cmp.find(`.${Selected}`).length).to.be.equal(0);
    exp(cmp.find(`.${Checked}`).length).to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(1);

    cmp.setProps({ value: emptyValue, });

    cmp.update();
    exp(cmp.find(`.${Selected}`).length).to.be.equal(0);
    exp(cmp.find(`.${Checked}`).length).to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(0);
  }

  it('props: defaultValue: 1,1.1,1.2  mutliple: true', () => {

    const cmp = mount(<ExpandAllTree data={rowData} defaultValue={'1,1.1,1.2'.split(',')} mutliple/>);
    const chkBoxes = cmp.find(CheckBox);
    exp(chkBoxes.at(0).hasClass(HalfChecked)).to.be.true;
    exp(chkBoxes.at(1).hasClass(Checked)).to.be.true;
    exp(chkBoxes.at(2).hasClass(HalfChecked)).to.be.true;
  });

  it('props: value 1  mutliple: true', () => {

    const cmp = mount(<ExpandAllTree data={rowData} value="1" mutliple/>);
    const chkBoxes = cmp.find(CheckBox);
    exp(chkBoxes.at(0).hasClass(HalfChecked)).to.be.true;
    exp(chkBoxes.at(1).hasClass(Checked)).to.be.false;
    exp(chkBoxes.at(2).hasClass(HalfChecked)).to.be.false;
  });

  it('props: defaultValue: 1,1.1,1.2 & value 1  mutliple: true', () => {

    const cmp = mount(<ExpandAllTree data={rowData} defaultValue="1,1.1,1.2" value="1" mutliple/>);
    const chkBoxes = cmp.find(CheckBox);
    exp(chkBoxes.at(0).hasClass(HalfChecked)).to.be.true;
    exp(chkBoxes.at(1).hasClass(Checked)).to.be.false;
    exp(chkBoxes.at(2).hasClass(HalfChecked)).to.be.false;
  });


  it('props: defaultValue: 1  mutliple: false', () => {

    const cmp = mount(<ExpandAllTree defaultValue="1" data={rowData} mutliple={false}/>);
    exp(cmp.find(CheckBox).length).to.be.equal(0);
    exp(cmp.find(TreeRow).first().hasClass(Selected)).to.be.true;
  });

  it('props: defaultValue: 1,1.1,1.2  mutliple: false', () => {
    const cmp = mount(<ExpandAllTree data={rowData} defaultValue="1,1.1,1.2" mutliple={false}/>);
    exp(cmp.find(CheckBox).length).to.be.equal(0);
    exp(cmp.find(TreeRow).first().hasClass(Selected)).to.be.false;
  });


  it('mutliple: true ,  onlySelectLeaf: true', async () => {

    const promise = new Promise(resolve => {
      const onChange = v => {
        resolve(v);
      };
      const cmp = mount(<Tree mutliple={true} expandAll data={rowData} onChange={onChange} onlySelectLeaf/>);
      cmp.find(CheckBoxInner).at(5).simulate('click', {});
      exp(cmp.find(`.${Selected}`).length).to.be.equal(0);
      exp(cmp.find(`.${Checked}`).length).to.be.equal(3);
      exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(3);
    });
    exp(await promise).to.be.eql(['1.2.2.1.1', '1.2.2.1.2',]);
  });
  it('mutliple: true ,  limitCount: 1', async () => {

    const promise = new Promise(resolve => {
      const onChange = (value, displayValue) => {
        resolve({ value, displayValue, });
      };
      const cmp = mount(<Tree mutliple={true} expandAll data={rowData} onChange={onChange} limitCount={1}/>);
      cmp.find(CheckBoxInner).at(5).simulate('click', {});


      cmp.update();
    });
    const result = await promise;
    exp(result).to.be.eql({ value: ['1.2.2.1',], displayValue: ['1.2.2.1',], });
  });

  it('mutliple: false ,  onlySelectLeaf: true', () => {
    const cmp = mount(<Tree mutliple={false} expandAll data={rowData}
                            onlySelectLeaf/>);
    cmp.find(TreeRow).at(5).simulate('click', {});


    cmp.update();
    exp(cmp.find(`${CheckBox}`).length).to.be.equal(0);
    exp(cmp.find(`.${Checked}`).length, '全选结点必须为0').to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`, '半选书必须为0').length).to.be.equal(0);
    exp(cmp.find(`.${Selected}`).length, '单选数应该为0').to.be.equal(0);
  });


  createIgronCase({ igron: [undefined, undefined,], mutliple: false, half: 0, all: 0, sel: 1, });
  createIgronCase({ igron: [null, null,], mutliple: false, half: 0, all: 0, sel: 1, });
  createIgronCase({ igron: ['', '',], mutliple: false, half: 0, all: 0, sel: 1, });
  createIgronCase({ igron: [1, 1,], mutliple: false, half: 0, all: 0, sel: 1, });
  createIgronCase({ igron: [0, 0,], mutliple: false, half: 0, all: 0, sel: 1, });
  createIgronCase({ igron: [true, true,], mutliple: false, half: 0, all: 0, sel: 0, });


  createIgronCase({ igron: [undefined, undefined,], mutliple: false, half: 0, all: 0, sel: 1, target: 0, });
  createIgronCase({ igron: [null, null,], mutliple: false, half: 0, all: 0, sel: 1, target: 0, });
  createIgronCase({ igron: ['', '',], mutliple: false, half: 0, all: 0, sel: 1, target: 0, });
  createIgronCase({ igron: [1, 1,], mutliple: false, half: 0, all: 0, sel: 1, target: 0, });
  createIgronCase({ igron: [0, 0,], mutliple: false, half: 0, all: 0, sel: 1, target: 0, });
  createIgronCase({ igron: [true, true,], mutliple: false, half: 0, all: 0, sel: 0, target: 0, });


  createIgronCase({ igron: [undefined, undefined,], mutliple: true, half: 1, all: 1, sel: 0, target: 0, });
  createIgronCase({ igron: [true, true,], mutliple: true, half: 0, all: 0, sel: 0, target: 0, });
  createIgronCase({ igron: [false, true,], mutliple: true, half: 1, all: 0, sel: 0, target: 0, });


  createIgronCase({ igron: [undefined, undefined,], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: [null, null,], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: ['', '',], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: [1, 1,], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: [0, 0,], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: [true, true,], mutliple: true, half: 0, all: 0, sel: 0, isLeaf: true, });


  createIgronCase({ igron: [undefined, undefined,], mutliple: true, half: 2, all: 0, sel: 0, });
  createIgronCase({ igron: [null, null,], mutliple: true, half: 2, all: 0, sel: 0, });
  createIgronCase({ igron: ['', '',], mutliple: true, half: 2, all: 0, sel: 0, });
  createIgronCase({ igron: [1, 1,], mutliple: true, half: 2, all: 0, sel: 0, });
  createIgronCase({ igron: [0, 0,], mutliple: true, half: 2, all: 0, sel: 0, });
  createIgronCase({ igron: [true, true,], mutliple: true, half: 0, all: 0, sel: 0, });


  createIgronCase({ igron: [undefined, undefined,], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: [null, null,], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: ['', '',], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: [1, 1,], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: [0, 0,], mutliple: true, half: 1, all: 1, sel: 0, isLeaf: true, });
  createIgronCase({ igron: [true, true,], mutliple: true, half: 0, all: 0, sel: 0, isLeaf: true, });

  function createIgronCase ({
                              igron,
                              mutliple,
                              half,
                              all,
                              sel,
                              isLeaf = false,
                              target = 1,
                            }: Object) {

    it(`mutliple: ${mutliple} ,  igronSelectField: igron is ${igron} isLeaf: ${isLeaf} target: ${target}`, () => {
      const data = [{ key: '1', title: 'hello1', igron: igron[ 0 ], }, {
        key: '1.1',
        title: 'hello2',
        pid: '1',
        path: '1',
        isLeaf,
        igron: igron[ 1 ],
      },];
      const cmp = mount(<Tree mutliple={mutliple} expandAll data={data} igronSelectField={'igron'}/>);
      cmp.find(mutliple ? CheckBox : TreeRow).at(target).simulate('click', {});
      exp(cmp.find(`.${Checked}`).length, '全选').to.be.equal(all);
      exp(cmp.find(`.${HalfChecked}`, '半选').length).to.be.equal(half);
      exp(cmp.find(`.${Selected}`).length, '单选数').to.be.equal(sel);
    });
  }

  it('mutliple: true ,  value： 在不可见的位置', () => {
    let target = {};
    const Target = createTestComponent(Tree, the => {
      target = the;
    });
    const cmp = mount(<Target value={'3.2'} data={rowData} mutliple expandAll/>);

    exp(cmp.find(`.${Checked}`).length, '全选结点必须为0').to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`, '半选书必须为0').length).to.be.equal(0);
    exp(cmp.find(`.${Selected}`).length, '单选数应该为0').to.be.equal(0);
    target.getThemeTarget().setState({ start: 17, }, () => {

    });

    cmp.update();
    exp(cmp.find(`.${Checked}`).length, '全选结点必须为0').to.be.equal(1);
    exp(cmp.find(`.${HalfChecked}`, '半选书必须为0').length).to.be.equal(1);
    exp(cmp.find(`.${Selected}`).length, '单选数应该为0').to.be.equal(0);
    const chkBox = cmp.find(CheckBox);
    exp(chkBox.at(chkBox.length - 4).hasClass(HalfChecked), '3被半选上').to.be.true;
    exp(chkBox.at(chkBox.length - 2).hasClass(Checked), '3.2被全选上').to.be.true;
  });

  it('mutliple: false ,  value： 在不可见的位置', () => {
    let target = {};
    const Target = createTestComponent(Tree, the => {
      target = the;
    });
    const cmp = mount(<Target value={'3.2'} data={rowData} expandAll/>);

    exp(cmp.find(`.${Checked}`).length, '全选结点必须为0').to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`, '半选书必须为0').length).to.be.equal(0);
    exp(cmp.find(`.${Selected}`).length, '单选数应该为0').to.be.equal(0);
    target.getThemeTarget().setState({ start: 17, }, () => {

    });

    cmp.update();
    exp(cmp.find(`.${Checked}`).length, '全选结点必须为0').to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`, '半选书必须为0').length).to.be.equal(0);
    exp(cmp.find(`.${Selected}`).length, '单选数应该为0').to.be.equal(1);
    const rows = cmp.find(TreeRow);
    exp(rows.at(rows.length - 2).hasClass(Selected)).to.be.true;
  });


  it('props:  expandAll:true | false,  mutliple: true , query:  1.3.2.1  & 1.3.2.1.1 & 1.3', () => {
    createMutlipleTreeQueryCase(true, true);
    createMutlipleTreeQueryCase(false, true);
  });

  it('props:  expandAll:true | false,  mutliple: false , query:  1.3.2.1  & 1.3.2.1.1 & 1.3', () => {
    createMutlipleTreeQueryCase(true, false);
    createMutlipleTreeQueryCase(false, false);
  });

  function createMutlipleTreeQueryCase (expandAll: boolean, mutliple: boolean) {

    const cmp = mount(<Tree data={rowData} expandAll={expandAll} mutliple={mutliple}/>);

    cmp.setProps({ query: '1.3.2.1', });

    cmp.update();
    const getValue = () => cmp.find(TreeRow).map(node => node.text()).join(',');
    exp(getValue()).to.be.equal('1,1.3,1.3.2,1.3.2.1');
    exp(cmp.find(TreeRow).length).to.be.equal(4);

    cmp.setProps({ query: '1.3.2.1.1', });

    cmp.update();
    exp(cmp.find(TreeRow).length).to.be.equal(0);

    cmp.setProps({ query: '1.3', });

    cmp.update();

    exp(getValue()).to.be.equal('1,1.3,1.3.1,1.3.1.1,1.3.1.2,1.3.2,1.3.2.1,1.3.2.2,1.3.3');
    exp(cmp.find(TreeRow).length).to.be.equal(9);
  }

  const Switcher = '.sv-tree-switcher';
  const SwitcherOpen = 'sv-tree-switcher_open';
  const SwitcherClose = 'sv-tree-switcher_close';
  it('expandAll: false 折叠测试', () => {
    const expandAll = true;
    const cmp = mount(<Tree data={rowData} expandAll={expandAll}/>);

    // 折叠 1
    expectNodeExpandStatue(cmp, 0, true);
    exp(cmp.find(TreeRow).at(1).text(), '第二个结点为1.1').to.be.equal('1.1');
    cmp.find(Switcher).at(0).simulate('click');

    cmp.update();
    exp(cmp.find(TreeRow).at(1).text(), '第二个结点为2').to.be.equal('2');
    expectNodeExpandStatue(cmp, 0, false);

    // 折叠 2
    expectNodeExpandStatue(cmp, 1, true);
    cmp.find(Switcher).at(1).simulate('click');

    cmp.update();
    expectNodeExpandStatue(cmp, 1, false);

    // 折叠 3
    expectNodeExpandStatue(cmp, 2, true);
    cmp.find(Switcher).at(2).simulate('click');

    cmp.update();
    expectNodeExpandStatue(cmp, 2, false);


    // 展开 1 操作
    cmp.find(Switcher).at(0).simulate('click');

    cmp.update();
    exp(cmp.find(TreeRow).at(1).text(), '第二个结点为2').to.be.equal('1.1');
    expectNodeExpandStatue(cmp, 0, true);

  });

  function expectNodeExpandStatue (cmp, index: number, open: boolean) {

    exp(cmp.find(Switcher).at(index).hasClass(open ? SwitcherOpen : SwitcherClose), '1 目前为展开').to.be.true;
    exp(cmp.find(Switcher).at(index).hasClass(open ? SwitcherClose : SwitcherOpen), '1 目前为展开').to.be.false;
  }

  const empty = '<span class="sc-iwsKbI hanuQI">查无结果</span>';
  it('data 为空的情况', () => {
    const cmp = mount(<Tree/>);
    exp(cmp.html()).to.be.equal(empty);
  });
  const error = '<span class="sc-gZMcBi gotTWc">树形数据错误错误</span>';
  it('树报错的情况', () => {

    const rowData: Array<Object> = [
      { key: '1', title: 'A', },
      { key: '1.1', title: 'A1.1', pid: '1', path: '1', isLeaf: true, },
      { key: '1.2', title: '一一一', pid: '1', path: '1', isLeaf: true, },
      { key: '1.1.1', title: 'A1.1.1', pid: '1.1', path: '1/1.1', isLeaf: true, },
      { key: '1.1.1.1', title: 'A1.1.1.1', pid: '1.1.1', path: '1/1.1/1.1.1', isLeaf: true, },

      { key: '2', title: 'B', },
      { key: '2.1', title: 'B2.1', pid: '2', path: '2', isLeaf: true, },
      { key: '2.1.1', title: 'B2.1.1', pid: '2.1', path: '2/2.1', isLeaf: true, },
      { key: '2.1.1.1', title: 'B2.1.1.1', pid: '2.1.1', path: '2/2.1/2.1.1', isLeaf: true, },
      { key: '2.1.1.1.1', title: 'B2.1.1.1.1', pid: '2.1.1.1', path: '2/2.1/2.1.1/2.1.1.1', isLeaf: true, },

      { key: '3', title: 'C', },
      { key: '3.1', title: 'C3.1', pid: '3', path: '3', isLeaf: true, },
      { key: '3.1.1', title: 'C3.1.1', pid: '3.1', path: '3/3.1', isLeaf: true, },

      { key: '4', title: 'D', },
      { key: '4.1', title: 'D4.1', pid: '4', path: '4', isLeaf: true, },
      { key: '4.1.1', title: 'D4.1.1', pid: '4.1', path: '4/4.1', isLeaf: true, },

      { key: '5', title: 'E', },
      { key: '5.1', title: 'E5.1', pid: '5', path: '5', isLeaf: true, },
      { key: '5.1.1', title: 'E5.1.1', pid: '5.1', path: '5/5.1', isLeaf: true, },

      { key: '6', title: 'F', },
      { key: '6.1', title: 'F6.1', pid: '6', path: '6', isLeaf: true, },
      { key: '6.1.1', title: 'F6.1.1', pid: '6.1', path: '6/6.1', isLeaf: true, },

      { key: '7', title: 'G', },
      { key: '7.1', title: 'G7.1', pid: '7', path: '7', isLeaf: true, },
      { key: '7.1.1', title: 'G7.1.1', pid: '7.1', path: '7/7.1', isLeaf: true, },
      { key: '7.1.1.1', title: 'G7.1.1.1', pid: '7.1.1', path: '7/7.1/7.1.1', isLeaf: true, },

      { key: '8', title: 'H', },
      { key: '8.1', title: 'H1', pid: '8', path: '8', isLeaf: true, },

      { key: '9', title: 'I', },
      { key: '9.1', title: 'I1', pid: '9', path: '9', isLeaf: true, },

      { key: '10', title: 'J', },
      { key: '10.1', title: 'J1', pid: '10', path: '10', isLeaf: true, },

      { key: '11', title: 'A+', },
      { key: '11.1', title: 'A+1', pid: '11', path: '11', isLeaf: true, },

      { key: '12', title: 'B+', },
      { key: '12.1', title: 'B+1', pid: '12', path: '12', isLeaf: true, },

      { key: '13', title: 'C+', },
      { key: '13.1', title: 'C+1', pid: '13', path: '13', isLeaf: true, },

      { key: '14', title: 'D+', },
      { key: '14.1', title: 'D+1', pid: '14', path: '14', isLeaf: true, },

      { key: '15', title: 'E+', },
      { key: '15.1', title: 'E+1', pid: '15', path: '15', isLeaf: true, },

      { key: '16', title: 'F+', },
      { key: '16.1', title: 'F+1', pid: '16', path: '16', isLeaf: true, },

      { key: '17', title: 'G+', },
      { key: '17.1', title: 'G+1', pid: '17', path: '17', isLeaf: true, },

      { key: '18', title: 'H+', },
      { key: '18.1', title: 'H+1', pid: '18', path: '18', isLeaf: true, },

      { key: '19', title: 'I+', },
      { key: '19.1', title: 'I+1', pid: '19', path: '19', isLeaf: true, },

      { key: '20', title: 'J+', },
      { key: '20.1', title: 'J+1', pid: '20', path: '20', isLeaf: true, },

      { key: '21', title: 'A++', },
      { key: '21.1', title: 'A++1', pid: '21', path: '21', isLeaf: true, },

      { key: '22', title: 'B++', },
      { key: '22.1', title: 'B++1', pid: '22', path: '22', isLeaf: true, },

      { key: '23', title: 'C++', },
      { key: '23.1', title: 'C++1', pid: '23', path: '23', isLeaf: true, },

      { key: '24', title: 'D++', },
      { key: '24.1', title: 'D++1', pid: '24', path: '24', isLeaf: true, },

      { key: '25', title: 'E++', },
      { key: '25.1', title: 'E++1', pid: '25', path: '25', isLeaf: true, },

    ];
    const cmp = mount(<Tree data={rowData} expandAll mutliple/>);
    cmp.setProps({ start: 1.5565931965863116, });
    exp(cmp.html()).to.be.equal(error);

  });

  it('data 为[]的情况', () => {
    const cmp = mount(<Tree data={[]}/>);
    exp(cmp.html()).to.be.equal(empty);
  });

  it('重新设置熟悉为 null 的情况', () => {
    const cmp = mount(<Tree data={rowData}/>);
    cmp.setProps({ data: null, });

    cmp.update();
    exp(cmp.html()).to.be.equal(empty);
  });

  it('多选树，shift键只选当前节点，不选择子节点', () => {

    const cmp = mount(<Tree data={rowData} expandAll mutliple/>);
    exp(cmp.find(`.${Checked}`).length).to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(0);

    cmp.find(CheckBox).at(0).simulate('click', { shiftKey: true, });
    cmp.update();
    exp(cmp.find(`.${Checked}`).length).to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(1);
    exp(cmp.find(CheckBox).at(0).hasClass(HalfChecked)).to.be.true;
  });
  it('多选树，shift键反选节点，', () => {

    const cmp = mount(<Tree data={rowData} expandAll mutliple/>);
    exp(cmp.find(`.${Checked}`).length).to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(0);

    cmp.find(CheckBox).at(0).simulate('click');
    // cmp.update();
    exp(cmp.find(`.${Checked}`).length).to.be.equal(14);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(0);


    cmp.find(CheckBox).at(0).simulate('click', { shiftKey: true, });
    // cmp.update();
    exp(cmp.find(`.${Checked}`).length).to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(0);
  });


  it('查询结果切换是value设置是否正确', () => {

    const cmp = mount(<Tree data={rowData} expandAll={true} mutliple={true}/>);
    cmp.setProps({ value: '3.1', });

    cmp.update();
    exp(cmp.find(`.${Checked}`).length).to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(0);

    cmp.setProps({ query: '3.1', });

    cmp.update();
    exp(cmp.find(`.${Checked}`).length).to.be.equal(1);
    exp(cmp.find(CheckBox).at(5).hasClass(HalfChecked)).to.be.true;
    exp(cmp.find(CheckBox).at(6).hasClass(Checked)).to.be.true;
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(1);

    cmp.setProps({ query: '', });

    cmp.update();
    exp(cmp.find(`.${Checked}`).length).to.be.equal(0);
    exp(cmp.find(`.${HalfChecked}`).length).to.be.equal(0);
  });
  it('查询所有时先移动滚动条到底部，而后进行查询。最后恢复为查询全部', () => {
    let target = {};
    const Target = createTestComponent(Tree, the => {
      target = the;
    });
    const cmp = mount(<Target value={'3.2'} data={rowData} mutliple expandAll/>);


    target.getThemeTarget().setState({ start: 17, }, () => {

    });

    cmp.update();
    exp(target.getThemeTarget().state.start, '移动滚动条到底部失败').to.be.equal(17);

    cmp.setProps({ query: '3.1', });

    cmp.update();
    exp(target.getThemeTarget().state.start, '查询后start统一移动到顶部').to.be.equal(17);

    cmp.setProps({ query: '', });

    cmp.update();
    exp(target.getThemeTarget().state.start, '恢复到原来的底部位置').to.be.equal(17);

  });

  it('多次查询', () => {

    const context = {
      config: {
        [ Widget.Tree ]: {
          height: 1000,
        },
      },
    };
    const cmp = mount(<Tree data={rowData} expandAll={true} mutliple={true}/>, { context, });

    const sepator = ',';
    const getValue = () => cmp.find(TreeRow).map(node => node.text()).join(sepator);
    const getTitle = item => item.title;
    exp(getValue()).to.be.equal(rowData.map(getTitle).join(sepator));
    cmp.setProps({ query: '3', });

    const query3Result = '1,1.3,1.3.1,1.3.1.1,1.3.1.2,1.3.2,1.3.2.1,1.3.2.2,1.3.3,3,3.1,3.2'.split(',');

    exp(getValue()).to.be.equal(query3Result.join(','));
    cmp.setProps({ value: query3Result, });
    exp(cmp.find('.' + Checked).length).to.be.equal(query3Result.length);

    const query2Result = '1,1.2,1.2.1,1.2.2,1.2.2.1,1.2.2.1.1,1.2.2.1.2,1.2.2.2,1.3,1.3.1,1.3.1.2,1.3.2,1.3.2.1,1.3.2.2,2,2.1,2.1.1,2.1.2,2.1.2.1,2.2,2.2.1,2.2.1.1,2.2.1.2,2.2.2,3,3.2'.split(',');
    cmp.setProps({ query: '2', });
    exp(getValue()).to.be.equal(query2Result.join(','));

    const value = {};
    const callback = v => {
      value[ v ] = true;
    };
    query3Result.forEach(callback);
    query2Result.forEach(callback);
    const mergerValue = Object.keys(value);
    cmp.setProps({ value: mergerValue, });

    cmp.setProps({ query: '', });
    exp(getValue()).to.be.equal(rowData.map(getTitle).join(sepator));
    exp(cmp.find('.' + Checked).length + cmp.find('.' + HalfChecked).length).to.be.equal(mergerValue.length);

  });

  it('height 为200的边界情况', () => {
    const cmp = mount(<Tree data={rowData} expandAll={true} start={23}/>);
    exp(cmp.find(TreeRow).last().text()).to.be.equal('4');
  });

  it('isSelectedAll all', () => {
    let target = {};
    const Target = createTestComponent(Tree, the => {
      target = the;
    });
    const cmp = mount(<Target data={rowData} expandAll={true} start={23} mutliple/>);

    exp(target.getThemeTarget().isSelectAll()).to.be.false;
    const value = rowData.map(item => item.key);
    cmp.setProps({ value, });
    exp(target.getThemeTarget().isSelectAll()).to.be.true;
  });
  it('isSelectedAll onlySelectLeaf', () => {
    let target = {};
    const Target = createTestComponent(Tree, the => {
      target = the;
    });
    const cmp = mount(<Target data={rowData} expandAll={true} start={23} mutliple onlySelectLeaf={true}/>);

    exp(target.getThemeTarget().isSelectAll()).to.be.false;
    const value = rowData.filter((item: Object) => item.isLeaf).map(item => item.key);
    cmp.setProps({ value, });
    exp(target.getThemeTarget().isSelectAll()).to.be.true;
  });

  it('height 为200的边界情况 超出范围', () => {
    const cmp = mount(<Tree data={rowData} expandAll={true} start={1000}/>);
    exp(cmp.find(TreeRow).last().text()).to.be.equal('4');
  });
  // displayValue的测试场景
  // value为4的场景

});
