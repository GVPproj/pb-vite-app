import { checkIfLoggedIn, getPb } from './pocketbaseUtils'
import { useEffect, useState } from 'react'
import { RecordModel } from 'pocketbase'

const Tests = () => {
  const [records, setRecords] = useState<RecordModel[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [text, setText] = useState('')

  const getPosts = async () => {
    const pb = getPb()
    const items = await pb.collection('posts').getFullList({
      sort: '-created',
    })
    setRecords(items)
  }

  const createPost = async () => {
    if (!text) return alert('Please enter some text')
    const pb = getPb()
    const data = {
      richText: `<h1>${text}</h1>`,
    }
    await pb.collection('posts').create(data)
    setIsUpdating(true)
    setText('')
  }

  const updatePost = async (index: number) => {
    const pb = getPb()
    const data = {
      richText: '<h1>testing 123</h1>' + `<p>${Math.random().toString()}</p>`,
    }
    await pb.collection('posts').update(records[index].id, data)
    setIsUpdating(true)
  }

  const deletePost = async (id: string) => {
    const pb = getPb()
    await pb.collection('tests').delete(id)
    setIsUpdating(true)
  }

  useEffect(() => {
    getPosts()
    setIsUpdating(false)
  }, [isUpdating])

  if (!checkIfLoggedIn()) return null
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '2rem',
      }}
    >
      <ul>
        {records.map((record, index) => {
          return (
            <li
              key={record.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '2rem',
                marginBottom: '1rem',
              }}
            >
              {record.richText}
              <button onClick={() => deletePost(record.id)}>Delete</button>
              <button onClick={() => updatePost(index)}>Update</button>
            </li>
          )
        })}
      </ul>
      <button onClick={createPost}>New</button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}

export default Tests
