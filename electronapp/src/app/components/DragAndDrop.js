import React, { Component } from 'react';
import cx from 'classnames';
import Button from './Button';

import './DragAndDrop.css';

const { ipcRenderer } = window.require('electron');

const fileSelector = () => {
  const selector = document.createElement('input');
  selector.setAttribute('type', 'file');
  return selector;
};

const isValidExtension = (fileName) => {
  const regex = new RegExp('(mp4|jpg)$');
  return regex.test(fileName);
};

export default class DragAndDrop extends Component {
  fileSelector = fileSelector();

  constructor(props) {
    super(props);
    this.state = {
      dragOver: false,
      dropped: false,
      filePath: '',
      error: '',
      gotReply: '',
    };
  }

  componentDidMount() {
    ipcRenderer.on('message-reply', this.onMessageReply);
  }

  onMessageReply = () => {
    this.setState({
      gotReply: 'ran script',
    });
  };

  onDrop = (e) => {
    const filePath = e.dataTransfer.files[0];

    if (isValidExtension(filePath.name)) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        dragOver: false,
        dropped: true,
        filePath: filePath.path,
        error: '',
      });
    } else {
      this.setState({
        dragOver: false,
        error: 'This is not a vaild file',
      });
    }
  };

  onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragOver: true,
    });
  };

  onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragOver: true,
    });
  };

  onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragOver: false,
    });
  };

  /* eslint-disable no-param-reassign */
  onButtonClick = (e) => {
    const { dropped } = this.state;
    if (dropped) {
      this.setState({
        dropped: false,
        filePath: '',
        gotReply: '',
      });
    } else {
      e.preventDefault();
      this.fileSelector.click();
      this.fileSelector.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (isValidExtension(file.name)) {
          const newPath = file.path;
          this.setState({
            dropped: true,
            filePath: newPath,
            error: '',
          });
          event.target.value = '';
        } else {
          this.setState({
            error: 'This is not a valid file',
          });
        }
      });
    }
  };

  onFeedClick = () => {
    const { filePath } = this.state;
    if (filePath !== '') {
      ipcRenderer.send('message', filePath);
    }
  };

  render() {
    const {
      dragOver,
      dropped,
      filePath,
      error,
      gotReply,
    } = this.state;

    const className = cx({
      dnd__wrapper: true,
      dnd__over: dragOver || dropped,
      dnd__dropped: dropped,
    });

    return (
      <div
        onDragOver={this.onDragOver}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDrop={this.onDrop}
        className={className}
      >
        {error !== '' ? <span>{error}</span> : null}
        {gotReply !== '' ? <span>{gotReply}</span> : null}
        <span className="path_text">{!dropped ? 'Drop your video file here' : `Selected file: ${filePath}`}</span>
        <span className="buttons__wrapper">
          <Button text={dropped ? 'Remove file' : 'Select file'} onClick={this.onButtonClick} />
          {dropped ? <Button text="feed file" onClick={this.onFeedClick} /> : null}
        </span>
      </div>
    );
  }
}
