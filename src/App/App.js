import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import ApiContext from '../ApiContext'
import config from '../config'
import './App.css'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import { countNotesForFolder } from '../notes-helpers'
import ErrorBoundry from '../ErrorBoundry'

class App extends Component {
  state = {
    notes: [],
    folders: []
  }

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/api/notes`),
      fetch(`${config.API_ENDPOINT}/api/folders`)
    ])

      .then(([notesRes, foldersRes]) => {
        console.log(notesRes)
        if (!notesRes.ok) return notesRes.json().then(e => Promise.reject(e))
        if (!foldersRes.ok)
          return foldersRes.json().then(e => Promise.reject(e))
        return Promise.all([notesRes.json(), foldersRes.json()])
      })

      .then(([notes, folders]) => {
        console.log('notes okay')
        console.log(notes)
        const numbers = {}
        folders.forEach(folder => {
          return (numbers[folder.id] = countNotesForFolder(notes, folder.id))
        })
        this.setState({ notes, folders, noteCount: numbers })
        console.log('state.notes')
        console.log(this.state.notes)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  handleDeleteNote = noteId => {
    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    })
  }

  handleAddFolder = folder => {
    this.setState({
      folders: [...this.state.folders, folder]
    })
  }

  handleAddNote = note => {
    const findFolder = (folders = [], folderId) =>
      folders.find(folder => folder.id === folderId)
    const newNoteCount = this.state.noteCount[note.folderId] + 1
    this.setState({
      notes: [...this.state.notes, note],
      noteCount: newNoteCount
    })
  }

  renderNavRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route path="/note/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    )
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map(path => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/note/:noteId" component={NotePageMain} />
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note" component={AddNote} />
      </>
    )
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      deleteNote: this.handleDeleteNote,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote,
      noteCount: this.state.noteCount
    }
    return (
      <ApiContext.Provider value={value}>
        <div className="App">
          <ErrorBoundry>
            <nav className="App__nav">{this.renderNavRoutes()}</nav>
          </ErrorBoundry>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{' '}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <ErrorBoundry>
            <main className="App__main">{this.renderMainRoutes()}</main>
          </ErrorBoundry>
        </div>
      </ApiContext.Provider>
    )
  }
}

export default App
