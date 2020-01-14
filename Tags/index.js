import React from "react";
import PropTypes from "prop-types";
import { View, TextInput } from "react-native";

import Tag from "./Tag";
import styles from "./styles";

class Tags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: props.initialTags,
      text: props.initialText
    };
  }

  componentWillReceiveProps(props) {
    const { initialTags = [], initialText = "" } = props;

    this.setState({
      tags: initialTags,
      text: initialText
    });
  }

  addTag = text => {

    const {conditionForAdd, conditionFailedCallback} = this.props

    if(text.trim() === '') {
      return
    }

    if(!conditionForAdd(text)) {
      conditionFailedCallback(text);
      return
    }

    this.setState(
        {
          tags: [...this.state.tags, text.trim()],
          text: ""
        },
        () => this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
    );
  };

  onKeyPress = (event: { nativeEvent: { key: string } }) => {
    if(this.state.text === '' && event.nativeEvent.key === 'Backspace') {
      const text = this.state.tags.slice(-1)[0] || ""
      this.setState(
          {
            tags: this.state.tags.slice(0, -1),
            text
          },
          () =>
          {
            this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
            this.props.onChangeText && this.props.onChangeText(text)
          }
      );
    }
  }

  onChangeText = text => {
    if (
        text.length > 1 &&
        this.props.createTagOnString.includes(text.slice(-1)) &&
        !(this.state.tags.indexOf(text.slice(0, -1).trim()) > -1)
    ) {
      this.addTag(text.slice(0, -1));
    } else {
      this.props.onChangeText && this.props.onChangeText(text)
      this.setState({ text });
    }
  };

  onSubmitEditing = () => {
    if (!this.props.createTagOnReturn) {
      return;
    }

    this.addTag(this.state.text);
  };

  render() {
    const {
      containerStyle,
      style,
      tagContainerStyle,
      tagTextStyle,
      deleteTagOnPress,
      onTagPress,
      readonly,
      maxNumberOfTags,
      inputStyle,
      inputContainerStyle,
      textInputProps,
      renderTag
    } = this.props;

    return (
        <View style={[styles.container, containerStyle, style]}>
          {this.state.tags.map((tag, index) => {
            const tagProps = {
              tag,
              index,
              deleteTagOnPress,
              onPress: e => {
                if (deleteTagOnPress && !readonly) {
                  this.setState(
                      {
                        tags: [
                          ...this.state.tags.slice(0, index),
                          ...this.state.tags.slice(index + 1)
                        ]
                      },
                      () => {
                        this.props.onChangeTags &&
                        this.props.onChangeTags(this.state.tags);
                        onTagPress && onTagPress(index, tag, e, true);
                      }
                  );
                } else {
                  onTagPress && onTagPress(index, tag, e, false);
                }
              },
              tagContainerStyle,
              tagTextStyle
            };

            return renderTag(tagProps);
          })}

          {!readonly && maxNumberOfTags > this.state.tags.length && (
              <View style={[styles.textInputContainer, inputContainerStyle]}>
                <TextInput
                    value={this.state.text}
                    style={[styles.textInput, inputStyle]}
                    onChangeText={this.onChangeText}
                    onSubmitEditing={this.onSubmitEditing}
                    underlineColorAndroid="transparent"
                    onKeyPress={this.onKeyPress}
                    selectionColor='rgb(96, 106, 123)'
                    {...textInputProps}
                    placeholder={this.state.tags && this.state.tags.length > 0 ? '' : textInputProps.placeholder}
                />
              </View>
          )}
        </View>
    );
  }
}

Tags.defaultProps = {
  initialTags: [],
  initialText: "",
  createTagOnString: [",", ""],
  createTagOnReturn: false,
  readonly: false,
  deleteTagOnPress: true,
  maxNumberOfTags: Number.POSITIVE_INFINITY,
  conditionForAdd: (text) => true,
  conditionFailedCallback: () => {},
  renderTag: ({ tag, index, ...rest }) => (
      <Tag key={`${tag}-${index}`} label={tag} {...rest} />
  )
};

Tags.propTypes = {
  initialText: PropTypes.string,
  initialTags: PropTypes.arrayOf(PropTypes.string),
  createTagOnString: PropTypes.array,
  createTagOnReturn: PropTypes.bool,
  onChangeTags: PropTypes.func,
  readonly: PropTypes.bool,
  maxNumberOfTags: PropTypes.number,
  deleteTagOnPress: PropTypes.bool,
  renderTag: PropTypes.func,
  /* style props */
  containerStyle: PropTypes.any,
  style: PropTypes.any,
  inputContainerStyle: PropTypes.any,
  inputStyle: PropTypes.any,
  tagContainerStyle: PropTypes.any,
  tagTextStyle: PropTypes.any,
  textInputProps: PropTypes.object,
  conditionForAdd: PropTypes.func,
  conditionFailedCallback: PropTypes.func
};

export { Tag };
export default Tags;
