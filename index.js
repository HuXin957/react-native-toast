import React from "react";
import Portal from "@huxin957/react-native-portal";
import ToastContainer from "./ToastContainer";

const SHORT = 1;
const toastKeyMap = {};//记录数量，便于删除

const defaultProps = {
  duration: SHORT,
  onClose: () => null,//关闭后的回调
  mask: true,//是否显示遮罩层，防止触摸
  stackable: true,//是否允许重叠显示
  position: 'center',//位置
  positionValue: 100,
};

function remove(key) {
  Portal.remove(key);
  delete toastKeyMap[key];
}

function removeAll() {
  Object.keys(toastKeyMap).forEach(key => {
    Portal.remove(Number.parseInt(key, 10));
  });
}

/**
 * @param content
 * @param type
 * @param duration
 * @param onClose
 * @returns {number}
 */

function notice(
  content,
  type,
  duration = defaultProps.duration,
  onClose = defaultProps.onClose,
) {
  let props = {
    ...defaultProps,
    content,
    type,
    duration,
    onClose,
  };

  if (typeof content !== "string") {
    props = {
      ...props,
      ...content,
    };
  }

  if (!props.stackable) {
    removeAll();
  }

  const key = Portal.add(
    <ToastContainer
      content={props.content}
      duration={props.duration}
      onClose={props.onClose}
      type={props.type}
      mask={props.mask}
      errorCode={props.errorCode}
      position={props.position}
      positionValue={props.positionValue}
      onAnimationEnd={() => {
        remove(key);
      }}
    />,
  );

  toastKeyMap[key] = 1;
  return key;
}

export default class Toast {
  static show(props, duration, onClose) {
    return notice(props, "show", duration, onClose);
  }

  static success(props, duration, onClose) {
    return notice(props, "success", duration, onClose);
  }

  static error(props, duration, onClose) {
    return notice(props, "error", duration, onClose);
  }

  static loading(props, duration, onClose) {
    return notice(props, "loading", 12, onClose);
  }

  static remove(key) {
    remove(key)
  }

  static removeAll() {
    removeAll()
  }
}
