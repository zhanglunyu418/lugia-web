/**
 *
 * create by guorg
 *
 * @flow
 */
import * as React from 'react';
import styled from 'styled-components';
import Alert from './alert';
import Widget from '../consts/index';
import Theme from '../theme';

const Demo = styled.div`
  margin: 50px;
  & > div {
    margin-bottom: 16px;
  }
`;
export default class AlertDemo extends React.Component<any, any> {
  render() {
    const view = {
      [Widget.Alert]: {
        width: 200,
        color: '#ffa500',
      },
    };
    return (
      <Demo>
        <Alert message="Alert-info" />
        <Alert type="success" message="Alert-success" />
        <Alert type="error" message="Alert-error" />
        <Alert type="warning" message="Alert-warning" />

        <Alert message="Alert-info" closable />
        <Alert type="success" message="Alert-success" closable />
        <Alert type="error" message="Alert-error" closable closeText="确定" />
        <Alert type="warning" message="Alert-warning" closable closeText="ok" />

        <Alert message="Alert-info" showIcon />
        <Alert type="success" message="Alert-success" showIcon />
        <Alert type="error" message="Alert-error" showIcon />
        <Alert type="warning" message="Alert-warning" showIcon />

        <Alert message="Alert-info" closable description="这是辅助性文字介绍" />
        <Alert type="success" message="Alert-success" closable description="这是辅助性文字介绍" />
        <Alert
          type="error"
          message="Alert-error"
          closable
          closeText="确定"
          description="这是辅助性文字介绍"
        />
        <Alert
          type="warning"
          message="Alert-warning"
          closable
          closeText="ok"
          description="这是辅助性文字介绍"
        />

        <Alert message="Alert-info" closable description="这是辅助性文字介绍" showIcon />
        <Alert
          type="success"
          message="Alert-success"
          closable
          description="这是辅助性文字介绍"
          showIcon
        />
        <Alert
          type="error"
          message="Alert-error"
          closable
          closeText="确定"
          description="这是辅助性文字介绍"
          showIcon
        />
        <Alert
          type="warning"
          message="Alert-warning"
          closable
          closeText="ok"
          description="这是辅助性文字介绍"
          showIcon
        />

        <p>Theme</p>
        <Theme config={view}>
          <Alert message="Alert-info" />
        </Theme>
        <Theme config={view}>
          <Alert showIcon message="Alert-info" />
        </Theme>
        <Theme config={view}>
          <Alert showIcon closable closeText="ok" message="Alert-info" />
        </Theme>
      </Demo>
    );
  }
}
