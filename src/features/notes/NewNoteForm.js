import React, { useState, useEffect } from 'react'
import { useAddNewNoteMutation } from './notesApiSlice'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

const NewNoteForm = ({ users }) => {

  const [addNewNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewNoteMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [userId, setUserId] = useState(users[0].id)

  useEffect(() => {
    if (isSuccess) {
      setTitle('')
      setText('')
      setUserId('')
      navigate('/dash/notes')
    }
  }, [isSuccess, navigate])

  const onTitleChanged = e => setTitle(e.target.value)
  const onTextChanged = e => setText(e.target.value)
  const onUserChanged = e => setUserId(e.target.value)


  const canSave = [title, text, userId].every(Boolean) && !isLoading
  const onSaveNoteClicked = async (e) => {
    console.log("in saveNote function")
    if (canSave) {
      await addNewNote({ title, text, user: userId })
    }
  }

  const options = users.map(user => {

    return (
      <option
        key={user.id}
        value={user.id}

      >{user.username} </option>
    )
  })

  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ''
  const validTextClass = !text ? "form__input--incomplete" : ''

  const errContent = (error?.data?.message) ?? ''

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className='form' onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>New Note</h2>

          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>          
          </div>
        </div>
        <label htmlFor="title" className="form__label">
          Title:</label>
        <input
          className={`form__input ${validTitleClass}`}
          id='title'
          name='title'
          type="text"
          autoComplete='off'
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="text" className="form__label">
          Text:</label>
        <textarea
          className={`form__input ${validTextClass}`}
          id='text'
          name='text'
          type="text"
          value={text}
          onChange={onTextChanged}
        />
        <div className="form__row">
          <div className="form__divider">
            <label className='form__label form__checkbox-container' htmlFor="note-username">ASSIGNED TO:</label>
            <select
              id='note-username'
              name='username'
              className='form__select'
              value={userId}
              onChange={onUserChanged}
            >
              {options}
            </select>
          </div>
        </div>
      </form>
    </>
  )


  return content
}

export default NewNoteForm