import React from "react";
import { Text, View, Animated, ActivityIndicator } from "react-native";
import y from "react-native-line-style";

export default class ToastContainer extends React.Component {
  anim = null;

  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { onClose, onAnimationEnd, duration } = this.props;
    const { fadeAnim } = this.state;
    const timing = Animated.timing;

    this.setState({ visible: true });
    if (this.anim) {
      this.anim = null;
    }

    const animArr = [
      timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true, //原生驱动
      }),
      Animated.delay(duration * 1000),
    ];

    if (duration > 0) {
      animArr.push(
        timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      );
    }

    this.anim = Animated.sequence(animArr);
    this.anim.start(() => {
      if (duration > 0) {
        this.anim = null;
        if (onClose) {
          onClose();
        }
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      }
    });
  }

  componentWillUnmount() {
    this.setState({
      visible: false,
    });
    if (this.anim) {
      this.anim.stop();
      this.anim = null;
    }
  }

  render() {
    const { content, errorCode, type, mask, position, positionValue } =
      this.props;
    const { fadeAnim } = this.state;

    const _position =
      position === "top"
        ? [y.ujs, y.top(positionValue)]
        : position === "bottom"
        ? [y.uje, y.bottom(positionValue)]
        : [y.ujc];

    return (
      <View
        pointerEvents={mask ? "box-only" : "box-none"}
        style={[y.uf1, y.w100, y.upr, ..._position]}
      >
        <View style={[y.plr(16)]}>
          <Animated.View style={[y.opacity(fadeAnim), y.udr, y.ujc, y.uac]}>
            {(() => {
              if (typeof content === "function" || type === "custom") {
                return content();
              }

              switch (type) {
                case "loading":
                  return (
                    <View
                      style={[
                        y.minh(70),
                        y.minw(80),
                        y.bgColor("rgba(0,0,0,.7)"),
                        y.uSelfCenter,
                        y.radiusA(4),
                        y.uac,
                        y.ujc,
                      ]}
                    >
                      <ActivityIndicator size="large" color={"#fff"} />
                    </View>
                  );
                case "show":
                  return (
                    <View
                      style={[
                        y.ptb(10),
                        y.plr(14),
                        y.bgColor('rgba(0,0,0,.7)'),
                        y.radiusA(8),
                      ]}
                    >
                      <Text style={[y.color("#fff"), y.fSize(12), y.utxc]}>
                        {content}
                      </Text>
                    </View>
                  );
                case "success":
                  return (
                    <View
                      style={[
                        y.ptb(10),
                        y.plr(14),
                        y.uac,
                        y.ujc,
                        y.bgColor("#fff"),
                        y.uSelfCenter,
                        y.radiusA(8),
                      ]}
                    >
                      <Text
                        style={[y.color("#555"), y.fSize(14), y.mt(14), y.utxc]}
                      >
                        {content}
                      </Text>
                    </View>
                  );
                case "error":
                  return (
                    <View
                      style={[
                        y.ptb(10),
                        y.plr(14),
                        y.bgColor("#FC5C65"),
                        y.radiusA(8),
                      ]}
                    >
                      <Text style={[y.color("#fff"), y.fSize(12)]}>
                        {content}
                      </Text>
                    </View>
                  );
              }
            })()}
          </Animated.View>
        </View>
      </View>
    );
  }
}
