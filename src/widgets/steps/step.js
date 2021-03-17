/**
 *
 * create by liangguodong on 2018/10/22
 *
 * @flow
 */
import '../common/shirm';
import * as React from 'react';
import Widget from '../consts/index';
import type { AlignType, OrientationType, SizeType, StepStatus, StepType } from '../css/steps';

import KeyBoardEventAdaptor from '../common/KeyBoardEventAdaptor';
import ThemeProvider from '../theme-provider';
import Icon from '../icon';
import CSSComponent, { css } from '@lugia/theme-css-hoc';
import { units } from '@lugia/css';
import { getBorder, getBorderRadius, getBoxShadow } from '@lugia/theme-utils';
import { deepMerge } from '@lugia/object-utils';
import get from '../css/theme-common-dict';
import changeColor from '../css/utilsColor';
const { px2remcss } = units;

const themeColor = '$lugia-dict.@lugia/lugia-web.themeColor';
const successColor = '$lugia-dict.@lugia/lugia-web.successColor';
const dangerColor = '$lugia-dict.@lugia/lugia-web.dangerColor';
const blackColor = '$lugia-dict.@lugia/lugia-web.blackColor';
const darkGreyColor = '$lugia-dict.@lugia/lugia-web.darkGreyColor';
const disableTextColor = '$lugia-dict.@lugia/lugia-web.disableTextColor';

export const isHorizontal = (orientation: OrientationType): boolean => {
  return orientation === 'horizontal';
};
const isNormalSize = (size: 'default' | 'small'): boolean => {
  return size === 'default' || size === 'normal';
};
const isSmallSize = (size: 'default' | 'small'): boolean => {
  return size === 'small' || size === 'mini';
};

const isDotType = (stepType: StepType): boolean => {
  return stepType === 'dot';
};

const isFlatType = (stepType: StepType): boolean => {
  return stepType === 'flat';
};

const getStepSize = (size: SizeType) => {
  return isNormalSize(size) ? 32 : 24;
};
const getTopCSS = top => {
  return `top:0;margin-top:${px2remcss(top)};`;
};

const flatBoxShadowColor = () => changeColor(get('themeColor'), 0, 0, 40).rgba;

const getSize = (
  isWidth: boolean,
  value: number | string,
  orientation: OrientationType,
  defaultValue: number | string
): number | string => {
  if (value) {
    return value;
  }
  const widthAndHorizontal = isWidth ? isHorizontal(orientation) : !isHorizontal(orientation);
  return widthAndHorizontal ? '100%' : defaultValue;
};
const getWhiteSpaceCSS = (width: string | number): string => {
  const theWhiteSpace = width ? 'normal' : 'nowrap';
  return `white-space:${theWhiteSpace};`;
};

const StepOutContainer = CSSComponent({
  tag: 'div',
  className: 'StepOutContainer',
  normal: {
    selectNames: [['width'], ['height']],
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { size, orientation } = propsConfig;
      const { width, height } = themeMeta;
      const type = isHorizontal(orientation) ? 'width' : 'height';
      let theSize;
      if (type === 'width') {
        theSize = width || '100%';
      } else {
        theSize = height ? height : isNormalSize(size) ? 82 : 74;
      }
      return {
        [type]: theSize,
      };
    },
  },
  css: css`
    display: inline-flex;
    cursor: pointer;
  `,
});

const BaseText = CSSComponent({
  tag: 'div',
  className: 'StepBaseText',
  normal: {
    selectNames: [['fontSize'], ['font'], ['color'], ['width'], ['height']],
  },
  css: css`
    position: absolute;
    display: block;
  `,
});

const Title = CSSComponent({
  extend: BaseText,
  className: 'StepTitle',
  normal: {
    selectNames: [['fontSize'], ['font'], ['color'], ['width'], ['height'], ['margin']],
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { size, stepType, orientation, desAlign } = propsConfig;
      let dirCSS = '';
      let positionCSS = '';
      const top = isDotType(stepType) ? 20 : isNormalSize(size) ? 40 : 30;
      const left = isDotType(stepType) ? 20 : isNormalSize(size) ? 35 : 30;
      if (isHorizontal(orientation)) {
        dirCSS = getTopCSS(top);
      } else {
        positionCSS = `transform: translateY(-50%);top:50%;left:${px2remcss(left)};`;
      }
      const alignCSS = `text-align:${desAlign && desAlign === 'center' ? 'center' : 'left'};`;
      return `white-space:nowrap;${dirCSS}${positionCSS}${alignCSS}`;
    },
    defaultTheme: {
      fontSize: 14,
    },
  },
});

const Description = CSSComponent({
  extend: BaseText,
  className: 'StepDescription',
  normal: {
    selectNames: [['fontSize'], ['font'], ['color'], ['width'], ['height'], ['margin']],
    getCSS(themeMeta, themeProps) {
      const { width } = themeMeta;
      const { propsConfig } = themeProps;
      const { size, stepType, orientation, stepContainerWidth, desAlign } = propsConfig;
      let top = 0;
      let left = 0;
      let maxWidthCSS = '';
      if (isHorizontal(orientation)) {
        top = isDotType(stepType) ? 40 : isNormalSize(size) ? 60 : 50;
        const maxWidth =
          stepContainerWidth && stepContainerWidth > 220 ? stepContainerWidth - 15 : 200;
        maxWidthCSS = `max-width:${px2remcss(maxWidth)};`;
      } else {
        top = isDotType(stepType) ? 15 : isNormalSize(size) ? 25 : 25;
        left = isDotType(stepType) ? 20 : isNormalSize(size) ? 35 : 30;
      }
      const topCSS = getTopCSS(top);
      const leftPosition = !isHorizontal(orientation) ? `left:${px2remcss(left)};` : '';
      const alignCSS = `text-align:${desAlign && desAlign === 'center' ? 'center' : 'left'};`;
      return `${getWhiteSpaceCSS(width)}${topCSS}${leftPosition}${maxWidthCSS}${alignCSS}`;
    },
    defaultTheme: {
      fontSize: 12,
    },
  },
  css: css`
    overflow: hidden;
  `,
});
const FlatLineContainer = CSSComponent({
  tag: 'div',
  className: 'StepFlatLineContainer',
  normal: {
    selectNames: [['width'], ['height']],
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { isFirst } = propsConfig;
      const display = isFirst ? 'width:0;' : 'flex: 1;';
      return `${display}`;
    },
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { orientation, size } = propsConfig;
      const { width, height } = themeMeta;
      const defaultSize = isSmallSize(size) ? 24 : 32;
      const theWidth = getSize(true, width, orientation, defaultSize);
      const theHeight = getSize(false, height, orientation, defaultSize);
      return {
        width: theWidth,
        height: theHeight,
      };
    },
  },
  css: css`
    display: inline-flex;
    z-index: 10;
  `,
});
const SimpleLineContainer = CSSComponent({
  tag: 'div',
  className: 'StepSimpleLineContainer',
  normal: {
    selectNames: [['width'], ['height']],
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { isFirst, orientation } = propsConfig;
      const margin = px2remcss(6);
      let hSize = margin;
      let vSize = 0;
      if (isHorizontal(orientation)) {
        hSize = 0;
        vSize = margin;
      }
      const display = isFirst ? 'width:0;' : 'flex: 1;';
      return `margin: ${hSize} ${vSize};${display}`;
    },
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { orientation } = propsConfig;
      const { width, height } = themeMeta;
      const theWidth = getSize(true, width, orientation, '100%');
      const theHeight = getSize(false, height, orientation, '100%');
      return {
        width: theWidth,
        height: theHeight,
      };
    },
  },
  css: css`
    display: inline-flex;
  `,
});
const SimpleLine = CSSComponent({
  tag: 'div',
  className: 'StepSimpleLine',
  normal: {
    selectNames: [['width'], ['height'], ['border'], ['margin']],
    getThemeMeta(themeMeta, themeProps) {
      const { background = {} } = themeMeta;
      const { propsConfig } = themeProps;
      const { orientation, isDashed } = propsConfig;
      const styled = isDashed ? 'dashed' : 'solid';
      const direction = isHorizontal(orientation) ? 'bottom' : 'left';
      const { height, width } = themeMeta;
      const theWidth = getSize(true, width, orientation, 1);
      const theHeight = getSize(false, height, orientation, 1);

      const size = isHorizontal(orientation) ? theHeight : theWidth;
      const theSize = orientation => {
        return isHorizontal(orientation) ? { width: theWidth } : { height: theHeight };
      };
      return {
        ...theSize(orientation),
        border: {
          [direction]: {
            width: size,
            style: styled,
            color: background.color,
          },
        },
      };
    },
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { orientation } = propsConfig;
      const transformCSS = isHorizontal(orientation) ? 'transform: translate(-50%, -50%);' : '';
      return `${transformCSS}`;
    },
  },
  css: css`
    position: relative;
    left: 50%;
  `,
});
const FlatLine = CSSComponent({
  tag: 'div',
  className: 'StepFlatLine',
  normal: {
    selectNames: [['width'], ['height'], ['boxShadow'], ['border'], ['background']],
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { height, width, boxShadow } = themeMeta;
      const { orientation } = propsConfig;
      const theWidth = getSize(true, width, orientation, 6);
      const theHeight = getSize(false, height, orientation, 6);
      const theBoxShadow = `0 0 2px ${flatBoxShadowColor()} inset`;
      const resBoxShadow = boxShadow || getBoxShadow(theBoxShadow);
      return {
        height: theHeight,
        width: theWidth,
        boxShadow: resBoxShadow,
      };
    },
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { orientation } = propsConfig;
      const { background: { color } = {} } = themeMeta;

      const getPosition = (type: 'after' | 'before') => {
        const before = type === 'before';
        const beforeDirection = isHorizontal(orientation) ? 'top' : 'left';
        const HAfterDirection = before ? 'left' : 'right';
        const VAfterDirection = before ? 'top' : 'bottom';
        const afterDirection = isHorizontal(orientation) ? HAfterDirection : VAfterDirection;
        return `
           ${beforeDirection}:${px2remcss(1)};
           ${afterDirection}:${px2remcss(-2)};
       `;
      };
      const commonCSS = ` content: '';
        opacity: 1;
        position: absolute;
        width: ${px2remcss(4)};
        height: ${px2remcss(4)};
        background:${color || 'white'}`;
      return `
       &::before {
        ${commonCSS}
        ${getPosition('before')}
    }
       &::after {
        ${commonCSS}
        ${getPosition('after')}
    }`;
    },
  },
  css: css`
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
});
const NormalFlatLine = CSSComponent({
  tag: 'div',
  className: 'StepNormalFlatLine',
  normal: {
    selectNames: [['width'], ['height'], ['background'], ['border'], ['boxShadow']],
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { height, width } = themeMeta;
      const { orientation } = propsConfig;
      const theWidth = getSize(true, width, orientation, 6);
      const theHeight = getSize(false, height, orientation, 6);
      return {
        height: theHeight,
        width: theWidth,
      };
    },
  },
  css: css`
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
});

const StepHeadContainer = CSSComponent({
  tag: 'div',
  className: 'StepStepHeadContainer',
  normal: {
    selectNames: [['width'], ['height']],
  },
});

const Dot = CSSComponent({
  tag: 'div',
  className: 'StepDot',
  normal: {
    selectNames: [
      ['background'],
      ['width'],
      ['height'],
      ['border'],
      ['borderRadius'],
      ['boxShadow'],
    ],
    defaultTheme: {
      width: 12,
      height: 12,
      borderRadius: getBorderRadius('50%'),
    },
  },
  css: css`
    display: inLine-block;
  `,
});
const IconContainer = CSSComponent({
  tag: 'div',
  className: 'StepIconContainer',
  normal: {
    selectNames: [['fontSize'], ['width'], ['height']],
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { size } = propsConfig;
      const { fontSize } = themeMeta;
      const theSize = fontSize || getStepSize(size);
      return {
        width: theSize,
        height: theSize,
      };
    },
    getCSS(themeMeta, themeProps) {
      const { propsConfig: { desAlign } = {} } = themeProps;
      return `${getTextAlignCenterCSS(desAlign)};`;
    },
  },
  css: css`
    text-align: left;
    position: relative;
    display: inline-flex;
  `,
});
const StepNumber = CSSComponent({
  tag: 'div',
  className: 'StepNumber',
  normal: {
    selectNames: [['color'], ['font'], ['fontSize']],
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { size } = propsConfig;
      const { font } = themeMeta;
      const theFontSize = font && font.size ? font.size : isNormalSize(size) ? 20 : 12;
      const theFontWeight = font && font.weight ? font.weight : 700;
      return {
        font: {
          weight: theFontWeight,
          size: theFontSize,
        },
      };
    },
  },
  css: css`
    display: inLine-block;
    user-select: none;
    text-align: center;
    line-height: 1;
  `,
});

const StepInner = CSSComponent({
  tag: 'div',
  className: 'StepInner',
  normal: {
    selectNames: [
      ['fontSize'],
      ['width'],
      ['height'],
      ['background'],
      ['border'],
      ['boxShadow'],
      ['borderRadius'],
    ],
    defaultTheme: {
      borderRadius: getBorderRadius('50%'),
    },
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { width, height } = themeMeta;
      const { size, stepType, stepStatus } = propsConfig;
      let theSize = 24;
      switch (stepStatus) {
        case 'finish':
        case 'process':
        case 'error':
          theSize = getStepSize(size);
          break;
        case 'next':
        case 'wait':
          theSize =
            isNormalSize(size) && isFlatType(stepType)
              ? 32
              : isSmallSize(size) && isFlatType(stepType)
              ? 24
              : isNormalSize(size)
              ? 20
              : 12;
          break;
        default:
          break;
      }

      const theWidth = width ? width : theSize;
      const theHeight = height ? height : theSize;
      return {
        width: theWidth,
        height: theHeight,
      };
    },
  },
  css: css`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  `,
});
const StepContainer = CSSComponent({
  tag: 'div',
  className: 'StepContainer',
  normal: {
    selectNames: [['height'], ['width']],
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { orientation } = propsConfig;
      const direction = isHorizontal(orientation) ? 'row' : 'column';
      const position = isHorizontal(orientation)
        ? 'align-items: center;'
        : 'justify-content: center;';
      return `flex-direction: ${direction}; ${position}`;
    },
  },
  css: css`
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
  `,
});
const DotContainer = CSSComponent({
  tag: 'div',
  className: 'StepDotContainer',
  normal: {
    selectNames: [],
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { orientation } = propsConfig;
      const direction = isHorizontal(orientation) ? 'row' : 'column';
      return `flex-direction: ${direction};`;
    },
  },
  css: css`
    position: relative;
    display: flex;
    height: 100%;
  `,
});

const BaseInnerContainer = CSSComponent({
  tag: 'div',
  className: 'StepBaseInnerContainer',
  normal: {
    selectNames: [['width'], ['height']],
  },
  css: css`
    text-align: center;
    position: relative;
    display: flex;
  `,
});

function getTextAlignCenterCSS(desAlign: AlignType) {
  return desAlign === 'center' ? 'justify-content: center;' : '';
}

const StepInnerContainer = CSSComponent({
  extend: BaseInnerContainer,
  className: 'StepInnerContainer',
  normal: {
    selectNames: [['width'], ['height']],
    getThemeMeta(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { width, height } = themeMeta;
      const { size } = propsConfig;
      const theSize = getStepSize(size);
      const theWidth = width ? width : theSize;
      const theHeight = height ? height : theSize;
      return {
        width: theWidth,
        height: theHeight,
      };
    },
    getCSS(themeMeta, themeProps) {
      const { propsConfig } = themeProps;
      const { stepStatus, stepType, desAlign } = propsConfig;
      const index =
        isFlatType(stepType) && (stepStatus === 'wait' || stepStatus === 'next') ? 9 : 11;
      return `z-index: ${index};${getTextAlignCenterCSS(desAlign)};`;
    },
  },
});
const DotInnerContainer = CSSComponent({
  extend: BaseInnerContainer,
  className: 'StepDotInnerContainer',
  normal: {
    selectNames: [['width'], ['height']],
    defaultTheme: {
      width: 12,
      height: 12,
    },
    getCSS(themeMeta, themeProps) {
      const { propsConfig: { desAlign } = {} } = themeProps;
      return `${getTextAlignCenterCSS(desAlign)};`;
    },
  },
});

type StepState = { stepStatus: StepStatus };

type StepProps = {
  title: React.Node,
  icon: string,
  description: React.Node,
  stepType: StepType,
  stepNumber: number,
  currentStepNumber: number,
  stepStatus: StepStatus,
  orientation: OrientationType,
  size: SizeType,
  getTheme: Function,
  isFirst: boolean,
  isDashed: boolean,
  desAlign: AlignType,
  themeProps: Object,
  getPartOfThemeProps: Function,
  getPartOfThemeHocProps: Function,
  getChildWidths: Function,
};

class Step extends React.Component<StepProps, StepState> {
  static defaultProps = {};
  static displayName = Widget.Step;
  title: any;
  desc: any;
  titleWidth: any;
  titleHeight: any;
  descWidth: any;
  descHeight: any;
  stepContainerWidth: any;

  constructor(props: StepProps) {
    super(props);
    this.title = React.createRef();
    this.desc = React.createRef();
  }

  static getDerivedStateFromProps(props: StepProps, state: StepState) {
    const { currentStepNumber, stepNumber, stepStatus } = props;
    const hasStatusInprops = stepStatus && stepStatus !== undefined;
    const theStepStatus = hasStatusInprops
      ? stepStatus
      : currentStepNumber > stepNumber
      ? 'finish'
      : currentStepNumber === stepNumber
      ? 'process'
      : 'wait';
    if (hasStatusInprops) {
      return { stepStatus };
    }
    return { stepStatus: theStepStatus };
  }

  getThemeByPartName(partName: string, isHoc?: boolean) {
    const { getPartOfThemeProps, getPartOfThemeHocProps } = this.props;
    const { stepStatus } = this.state;
    let thePartName;
    switch (stepStatus) {
      case 'finish':
        thePartName = `Finish${partName}`;
        break;
      case 'process':
        thePartName = `Process${partName}`;
        break;
      case 'next':
        thePartName = `Next${partName}`;
        break;
      case 'error':
        thePartName = `Error${partName}`;
        break;
      case 'wait':
      default:
        thePartName = `Wait${partName}`;
        break;
    }
    return isHoc ? getPartOfThemeHocProps(thePartName) : getPartOfThemeProps(thePartName);
  }

  componentDidMount() {
    if (this.title.current) {
      this.titleHeight = this.title.current.offsetHeight;
      this.titleWidth = this.title.current.offsetWidth;
    }
    if (this.desc.current) {
      this.descHeight = this.desc.current.offsetHeight;
      this.descWidth = this.desc.current.offsetWidth;
    }

    const { getChildWidths } = this.props;
    getChildWidths &&
      getChildWidths({
        titleWidth: this.titleWidth,
        titleHeight: this.titleHeight,
        descWidth: this.descWidth,
        descHeight: this.descHeight,
      });
  }
  render() {
    const { stepStatus, size, isFirst, orientation, stepType } = this.props;
    if (isFirst) {
      return this.getStepContainer();
    }
    const resultTheme = this.getThemeColorConfig(
      'color',
      this.getStepStatusColor(stepStatus, stepType)
    );
    const theThemeProps = this.getThemeByPartName('StepOutContainer');
    const {
      themeConfig: { normal },
    } = theThemeProps;
    if (normal && normal.width) {
      this.stepContainerWidth = normal.width;
    }
    theThemeProps.propsConfig = {
      size,
      orientation,
    };
    const stepOutThemeProps = deepMerge(resultTheme, theThemeProps);

    return (
      <StepOutContainer themeProps={stepOutThemeProps}>{this.getStepContainer()}</StepOutContainer>
    );
  }

  getThemeColorConfig(CSSType: string, color: string): Object {
    return CSSType === 'background' ? { background: { color } } : { color };
  }
  getStepFontColor(stepStatus: StepStatus, stepType: StepType, type?: string) {
    let resultConfigColor;
    switch (stepStatus) {
      case 'error':
        resultConfigColor = dangerColor;
        break;
      case 'finish':
        const finishColor =
          isFlatType(stepType) && type === 'title'
            ? themeColor
            : type === 'desc'
            ? darkGreyColor
            : blackColor;
        resultConfigColor = finishColor;
        break;
      case 'process':
        const processColor = type === 'desc' ? darkGreyColor : blackColor;
        resultConfigColor = processColor;
        break;
      case 'next':
      case 'wait':
      default:
        resultConfigColor = disableTextColor;
        break;
    }
    return resultConfigColor;
  }
  getStepStatusColor(stepStatus: StepStatus, stepType: StepType) {
    let resultConfigColor;
    switch (stepStatus) {
      case 'finish':
        const finishColor = isFlatType(stepType) ? get('themeColor') : get('successColor');
        resultConfigColor = finishColor;
        break;
      case 'process':
      case 'next':
        resultConfigColor = get('themeColor');
        break;
      case 'wait':
        resultConfigColor = get('borderColor');
        break;
      case 'error':
      default:
        resultConfigColor = get('dangerColor');
        break;
    }
    return resultConfigColor;
  }

  getStepContainer() {
    const { stepType, isFirst, size, orientation } = this.props;

    const type = isHorizontal(orientation) ? 'width' : 'height';
    const theSize =
      isDotType(stepType) && isFirst
        ? 12
        : isNormalSize(size) && isFirst
        ? 32
        : isSmallSize(size) && isFirst
        ? 24
        : '100%';

    const stepContainerTheme = {
      themeConfig: {
        normal: {
          [type]: theSize,
        },
      },
    };
    const theThemeProps = this.getThemeByPartName('StepContainer');
    theThemeProps.propsConfig = { isFirst };
    const finalThemeProps = deepMerge(stepContainerTheme, theThemeProps);
    return <StepHeadContainer themeProps={finalThemeProps}>{this.getStepHead()}</StepHeadContainer>;
  }

  getDesc() {
    const { description, size, stepType, orientation, desAlign } = this.props;
    const { stepStatus } = this.state;
    if (description && description !== undefined) {
      const resultTheme = this.getThemeNormalConfig(
        this.getThemeColorConfig('color', this.getStepFontColor(stepStatus, stepType, 'desc'))
      );
      const theThemeProps = this.getThemeByPartName('StepDescription');

      theThemeProps.propsConfig = {
        size,
        stepType,
        orientation,
        desAlign,
        stepContainerWidth: this.stepContainerWidth,
      };

      const desThemeProps = deepMerge(resultTheme, theThemeProps);

      return (
        <Description ref={this.desc} themeProps={desThemeProps}>
          {description}
        </Description>
      );
    }
    return null;
  }

  getTitle() {
    const { title, size, orientation, stepType, desAlign } = this.props;
    const { stepStatus } = this.state;
    const resultTheme = this.getThemeNormalConfig(
      this.getThemeColorConfig('color', this.getStepFontColor(stepStatus, stepType, 'title'))
    );
    const theThemeProps = this.getThemeByPartName('StepTitle');
    theThemeProps.propsConfig = {
      size,
      stepType,
      orientation,
      desAlign,
    };
    const titleThemeProps = deepMerge(resultTheme, theThemeProps);
    return (
      <Title ref={this.title} themeProps={titleThemeProps}>
        {title}
      </Title>
    );
  }

  getStepHead() {
    const { stepType, orientation, desAlign } = this.props;
    const { stepStatus } = this.state;

    const theThemeProps = this.getThemeByPartName('StepContainer');
    theThemeProps.propsConfig = {
      orientation,
    };
    const dotThemeProps = this.getThemeByPartName('StepDot');
    dotThemeProps.propsConfig = {
      orientation,
      desAlign,
    };

    if (isDotType(stepType)) {
      const resultTheme = this.getThemeNormalConfig(
        this.getThemeColorConfig('background', this.getStepStatusColor(stepStatus, stepType))
      );
      const theDotThemeProps = deepMerge(resultTheme, dotThemeProps);
      return (
        <DotContainer themeProps={theDotThemeProps}>
          {this.matchLine()}
          <DotInnerContainer themeProps={theDotThemeProps}>
            <Dot themeProps={theDotThemeProps} />
            {this.getTitle()}
            {this.getDesc()}
          </DotInnerContainer>
        </DotContainer>
      );
    }

    return (
      <StepContainer themeProps={theThemeProps}>
        {this.matchLine()}
        {this.getStep()}
      </StepContainer>
    );
  }

  matchLine() {
    const { stepType, isFirst, orientation, size } = this.props;
    if (isFirst) {
      return null;
    }

    const theThemeProps = this.getThemeByPartName('StepLine');
    theThemeProps.propsConfig = {
      isFirst,
      stepType,
      orientation,
      size,
    };

    return isFlatType(stepType) ? (
      <FlatLineContainer themeProps={theThemeProps}>{this.getFlatLine()}</FlatLineContainer>
    ) : (
      <SimpleLineContainer themeProps={theThemeProps}>{this.getSimpleLine()}</SimpleLineContainer>
    );
  }

  getFlatLine() {
    const { isDashed, stepType, orientation } = this.props;
    const { stepStatus } = this.state;
    const resultTheme = this.getThemeNormalConfig(
      this.getThemeColorConfig('background', this.getStepStatusColor(stepStatus, stepType))
    );
    const theThemeProps = this.getThemeByPartName('StepFlatLine');
    theThemeProps.propsConfig = {
      orientation,
      isDashed,
      stepType,
      stepStatus,
    };

    const finalThemeProps = deepMerge(resultTheme, theThemeProps);
    if (stepStatus === 'wait' || stepStatus === 'next') {
      return <FlatLine themeProps={theThemeProps} />;
    }
    return <NormalFlatLine themeProps={finalThemeProps} />;
  }
  getSimpleLine() {
    const { isDashed, stepType, orientation } = this.props;
    const { stepStatus } = this.state;
    const resultTheme = this.getThemeNormalConfig(
      this.getThemeColorConfig('background', this.getStepStatusColor(stepStatus, stepType))
    );
    const theThemeProps = this.getThemeByPartName('StepLine');
    theThemeProps.propsConfig = {
      orientation,
      isDashed,
      stepType,
      stepStatus,
    };
    const lineThemeProps = deepMerge(resultTheme, theThemeProps);
    return <SimpleLine themeProps={lineThemeProps} />;
  }

  getStepBackgroundColor(stepStatus: StepStatus, stepType: StepType) {
    const color =
      (stepStatus === 'finish' || stepStatus === 'process') && isFlatType(stepType)
        ? get('themeColor')
        : stepStatus === 'process'
        ? themeColor
        : stepStatus === 'error' && isFlatType(stepType)
        ? dangerColor
        : 'white';
    return color;
  }
  getStep() {
    const { stepType, size, orientation, desAlign } = this.props;
    const { stepStatus } = this.state;
    if (isFlatType(stepType) || stepType === 'simple') {
      const innerContainerThemeProps = this.getThemeByPartName('StepInnerContainer');
      innerContainerThemeProps.propsConfig = {
        stepType,
        size,
        orientation,
        stepStatus,
        desAlign,
      };
      const boxShadowConfig =
        isFlatType(stepType) && (stepStatus === 'wait' || stepStatus === 'next')
          ? this.getThemeNormalConfig({
              boxShadow: getBoxShadow(`0 0 2px ${flatBoxShadowColor()} inset`),
            })
          : {};

      const borderConfig =
        stepType !== 'flat'
          ? this.getThemeNormalConfig({
              border: getBorder({
                color: this.getStepStatusColor(stepStatus, stepType),
                width: 1,
                style: 'solid',
              }),
            })
          : {};
      const innerThemeProps = deepMerge(
        boxShadowConfig,
        borderConfig,
        this.getThemeNormalConfig(
          this.getThemeColorConfig('background', this.getStepBackgroundColor(stepStatus, stepType))
        ),
        innerContainerThemeProps
      );

      const { theme: iconThemeProps, viewClass: iconViewClass } = this.getThemeByPartName(
        'StepInnerIcon',
        true
      );

      const newIconTheme = deepMerge(
        {
          [iconViewClass]: {
            normal: {
              getCSS() {
                return `
                display: inline-block;
                user-select: none;
                text-align: center;
                font-weight: 700;
                line-height: 1;
                z-index: 5;`;
              },
              getThemeMeta(themeMeta, themeProps) {
                const { color } = themeMeta;
                const { propsConfig } = themeProps;
                const { stepType, stepStatus, size } = propsConfig;
                const theColor = color
                  ? color
                  : isFlatType(stepType)
                  ? 'white'
                  : stepStatus === 'finish'
                  ? successColor
                  : stepStatus === 'error'
                  ? dangerColor
                  : themeColor;
                const theSize = isFlatType(stepType) && isNormalSize(size) ? 24 : 18;
                return {
                  color: theColor,
                  fontSize: theSize,
                };
              },
            },
          },
        },
        iconThemeProps
      );
      const { finishIcon, errorIcon } = this.props;
      const theIcon =
        stepStatus === 'finish'
          ? finishIcon || 'lugia-icon-reminder_check'
          : stepStatus === 'error'
          ? errorIcon || 'lugia-icon-reminder_close'
          : '';
      return (
        <StepInnerContainer themeProps={innerContainerThemeProps}>
          <StepInner
            themeProps={innerThemeProps}
            stepType={stepType}
            size={size}
            orientation={orientation}
            stepStatus={stepStatus}
          >
            {stepStatus === 'finish' || stepStatus === 'error' ? (
              <Icon
                propsConfig={{ ...this.getConfigs(), size }}
                iconClass={theIcon}
                theme={newIconTheme}
                viewClass={iconViewClass}
                singleTheme
              />
            ) : null}
            {this.getStepNumber()}
          </StepInner>
          {this.getTitle()}
          {this.getDesc()}
        </StepInnerContainer>
      );
    }
    if (stepType === 'icon') {
      return this.getIconStep();
    }
  }
  getIconStep() {
    const { icon = 'lugia-icon-financial_cloud', size, desAlign } = this.props;
    const { stepStatus } = this.state;

    const { theme: iconThemeProps, viewClass: iconViewClass } = this.getThemeByPartName(
      'StepIcon',
      true
    );
    const newIconTheme = deepMerge(
      {
        [iconViewClass]: {
          normal: {
            getCSS() {
              return `
                  position: absolute;
                  user-select: none;
                  text-align: center;
                  font-weight: 700;
                  line-height: 1;
                  top: 50%;
                  transform: translateY(-50%);`;
            },
            getThemeMeta(themeMeta, themeProps) {
              const { color, fontSize } = themeMeta;
              const { propsConfig } = themeProps;
              const { stepStatus, size } = propsConfig;
              const theFontSize = fontSize || getStepSize(size);
              const theColor = color
                ? color
                : stepStatus === 'finish'
                ? successColor
                : stepStatus === 'process' || stepStatus === 'next'
                ? themeColor
                : stepStatus === 'wait'
                ? disableTextColor
                : stepStatus === 'error'
                ? dangerColor
                : themeColor;

              return {
                fontSize: theFontSize,
                color: theColor,
              };
            },
          },
        },
      },
      iconThemeProps
    );

    return (
      <IconContainer
        themeProps={this.props.getPartOfThemeProps('StepIcon', { props: { size, desAlign } })}
      >
        <Icon
          iconClass={icon}
          propsConfig={{ stepStatus, size }}
          theme={newIconTheme}
          viewClass={iconViewClass}
          singleTheme
        />
        {this.getTitle()}
        {this.getDesc()}
      </IconContainer>
    );
  }

  getStepValue(stepNumber: number, stepStatus: StepStatus): number {
    return (stepStatus === 'finish' || stepStatus === 'process') && stepNumber > 0 ? stepNumber : 0;
  }

  getStepNumber() {
    const { size, stepNumber } = this.props;
    const { stepStatus } = this.state;
    const theStepNumber = this.getStepValue(stepNumber, stepStatus);
    if (stepStatus === 'process') {
      const theThemeProps = this.getThemeByPartName('StepNumber');
      theThemeProps.propsConfig = { size };

      const stepNumberThemeProps = deepMerge(
        this.getThemeNormalConfig({ color: 'white' }),
        theThemeProps
      );
      return (
        <StepNumber size={size} themeProps={stepNumberThemeProps}>
          {theStepNumber}
        </StepNumber>
      );
    }
    return null;
  }
  getThemeNormalConfig(normalConfig: Object) {
    return { themeConfig: { normal: normalConfig } };
  }
  getConfigs() {
    const { stepType } = this.props;
    const { stepStatus } = this.state;
    return {
      stepType,
      stepStatus,
    };
  }
}

export const _Step = Step;
const TargetStep = ThemeProvider(KeyBoardEventAdaptor(Step), Widget.Step);
export default TargetStep;
