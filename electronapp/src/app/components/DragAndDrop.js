import React, {Component} from 'react'
import Button from './Button'
import cx from 'classnames'

import './DragAndDrop.css'

const fileSelector = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    return fileSelector
}

const isValidExtension = (fileName) => {
    let regex = new RegExp("(mp4|jpg)$");
    console.log(regex.test(fileName))
    return regex.test(fileName)

}

export default class DragAndDrop extends Component {

    state = {
        dragOver: false,
        dropped: false,
        filePath: "",
        error: ""
    }

    fileSelector = fileSelector()

    onDrop = (e) => {
        let filePath = e.dataTransfer.files[0]

        if (isValidExtension(filePath.name)){
            e.preventDefault()
            e.stopPropagation()
            this.setState({
                dragOver: false,
                dropped: true,
                filePath: filePath.path,
                error: ""
            })}
        else {
            this.setState({
                dragOver: false,
                error: "This is not a vaild file"
            })
        }
    }

    onDragEnter = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            dragOver: true
        })
    }

    onDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            dragOver: true
        })
    }

    onDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            dragOver: false
        })
    }

    onButtonClick = (e) => {
        if (this.state.dropped) {
            this.setState({
                dropped: false,
                filePath: ""
            })}
        else {
            e.preventDefault()
            this.fileSelector.click()
            this.fileSelector.addEventListener('change', e => {
                let file = e.target.files[0]
                if (isValidExtension(file.name)) {
                    let filePath = file.path
                    this.setState({
                        dropped: true,
                        filePath: filePath,
                        error: ""
                    })
                    e.target.value = ''
                } else {
                    this.setState({
                        error: "This is not a valid file"
                    })
                }
            })
        }
    }

    render() {

        const { dragOver, dropped, filePath, error } = this.state

        let className = cx({
            "dnd__wrapper": true,
            "dnd__over": dragOver || dropped,
            "dnd__dropped": dropped
        })

        return (

            <div onDragOver={this.onDragOver}
                 onDragEnter={this.onDragEnter}
                 onDragLeave={this.onDragLeave}
                 onDrop={this.onDrop}
                 className={className}>
                {error !== "" ? <span>{error}</span> : null }
                <span className="path_text">{!dropped ? "Drop your video file here" : "Selected file: "+filePath}</span>
                <span>
                    <Button text={dropped? "Remove file" : "Select file"} onClick={this.onButtonClick}/>
                </span>
            </div>
        )
    }

}