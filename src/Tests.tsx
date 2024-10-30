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
    await pb.collection('posts').delete(id)
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
      {records.map((record, index) => {
        return (
          <>
            <div
              className="bg-blue-500 text-white p-4  prose"
              key={record.id}
              dangerouslySetInnerHTML={{ __html: record.richText }}
            ></div>
            <button onClick={() => deletePost(record.id)}>Delete</button>
            <button onClick={() => updatePost(index)}>Update</button>
          </>
        )
      })}
      <button onClick={createPost}>New</button>
      <input
        type="text"
        width={300}
        placeholder="Enter some text"
        className="bg-indigo-500 text-white p-4 rounded-md"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}

export default Tests
