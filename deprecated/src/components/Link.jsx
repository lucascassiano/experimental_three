import React, {Component} from 'react'
import {shell} from 'electron'

export default class Link extends Component {

    link (url) {
        shell.openExternal(url)
    }

    render () {
        return (
            <a href='#' onClick={ () => {this.link(this.props.to)} } className={styles.link} >
                {this.props.children}
            </a>
        )
    }
}
