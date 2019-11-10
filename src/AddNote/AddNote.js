import React from 'react'
import config from '../config'
import ApiContext from '../ApiContext'
import PropTypes from 'prop-types'
import './AddNote.css'


class AddNote extends React.Component {

  static defaultProps = {
    history: {
      push: () => {}
    },
  }

static contextType = ApiContext;

  handleSubmit = e => {
    e.preventDefault();

    const newNote = {
      name: e.target["noteName"].value,
      folderId: e.target["noteFolderId"].value,
      modified: new Date(),
      content: e.target["noteContent"].value
    }

    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })

    .then(res => {
      if (!res.ok)
        return res.json().then(error => { throw error })
      return res.json()
    })

    .then(note => {
      newNote.id = note.id
      this.context.addNote(newNote)
      this.props.history.push(`/folder/${note.folderId}`)
    })

    .catch(error => {
      console.error({ error })
    })
  }

  render() {

    const { folders=[] } = this.context

    return (

      <form className="AddNote" onSubmit={this.handleSubmit} >

        <h2>Create a Note</h2>

        <div className="nameField">
          <label htmlFor="noteName">Note Name: </label>
          <input 
            type="text" 
            className="noteNameInput"
            name="noteName" 
            id="noteName" 
            required
          />
        </div>

        <div className="contentField">
          <label htmlFor="noteContent">Content:</label>
          <input 
            type="text" 
            className="noteContentInput" 
            name="noteContent" 
            id="noteContent" 
            required
          />
        </div>
        
        <div className="selectionField">
          <label htmlFor="folderSelection">
            Choose Folder: 
          </label>
          <select 
          className ="folderSelection"
            id="folderSelection" 
            name="noteFolderId" 
            onChange={e => this.context.folder = e.target.value || null}
            value={this.context.folders.id}
            required 
          >
            <option value=''></option>
              {folders.map(folder => 
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
          </select>
        </div>

        <button 
          type="submit" 
          className="AddNote__button" 
          
          >Add Note</button>
      </form>
    )
  }
}

AddNote.propTypes = {
  id: PropTypes.string
}

export default AddNote