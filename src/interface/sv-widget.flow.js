//@flow
declare module 'sv-widget' {

  declare  type InputState = {|
    value: string,
  |};

  declare type GetValueArgType = {|
    defaultValue?: string,
    value?: string
  |};

  declare type InputProps = {|
    prefix?: React$Element<any>,
    suffix?: React$Element<any>,
    onChange?: (newValue: any, oldValue: any) => void,
    onKeyUp?: (event: KeyboardEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyPress?: (event: KeyboardEvent) => void;
    onFocus?: (event: UIEvent) => void;
    onBlur?: (event: UIEvent) => void;
    /*
     * 当键入回车时触发事件
     */
    onEnter?: (event: UIEvent) => void;
    defaultValue?: string,
    value?: string
  |};

  declare type InputTagProps = {
    value: Array<String>,
    children: Array<Object>
  };
  declare  type InputTagState = {
    items: Array<Object>
  };
}
