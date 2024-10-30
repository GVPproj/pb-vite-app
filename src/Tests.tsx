import { checkIfLoggedIn, getPb } from './pocketbaseUtils'
import { useEffect, useState } from 'react'
import { RecordModel } from 'pocketbase'

const Tests = () => {
  const [records, setRecords] = useState<RecordModel[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [text, setText] = useState('')

  const getPosts = async () => {
    const pb = getPb()
    const items = await pb.collection('tests').getFullList({
      sort: '-created',
    })
    // console.log(records)
    setRecords(items)
  }

  const createPost = async () => {
    if (!text) return alert('Please enter some text')
    const pb = getPb()
    const data = {
      testText: text,
    }
    await pb.collection('tests').create(data)
    setIsUpdating(true)
    setText('')
  }

  const updatePost = async (index: number) => {
    const pb = getPb()
    const data = {
      testText: 'testing 123' + Math.random().toString(),
    }
    await pb.collection('tests').update(records[index].id, data)
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
              {record.testText}
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
