import React, { Component } from 'react'
import './AddFolder.css'
import ApiContext from '../ApiContext';
import config from '../config';

export default class AddFolder extends Component {

  static defaultProps = {
    addFolder: () => {}
  }

  static contextType = ApiContext

  handleSubmitAF = e => {
    e.preventDefault()

    const newFolder = {
      name: e.target['newFolderName'].value
    }

    fetch(`${config.API_ENDPOINT}/folders/`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(newFolder)
        })

      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            console.log(error)
            throw error
          })
        }
        return res.json()
      })

      .then((folder) => {
        newFolder.id = folder.id
        this.context.addFolder(folder)
        this.props.history.push('/')
        console.log('added folder')
      })
          
      .catch(error => {
        console.error({ error })
      })
    }


  render () {

    return (

      <form 
        className="AddFolder" 
        onSubmit={e => this.handleSubmitAF(e)} 
        >

        <h2>Add Folder</h2>

        <div className="form-group">
          <label htmlFor="newFolderName">Folder Name</label>
          <input 
            type="text" 
            className="AddFolder__input"
            name="newFolderName" 
            id="newFolderName" 
            required/>
        </div>

        <button 
          type="submit"
          className="AddFolder__delete" 
          >
          Submit
        </button>

      </form>
    )
  }
}