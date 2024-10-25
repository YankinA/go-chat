import { useState } from 'preact/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { sendRoom } from '../store/actions/roomActions'
import { Button, Input, Space } from 'antd'
import { RootState } from '../store'
import { ConnStatus } from '../store/types'

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('')
  const dispatch = useDispatch()
  const connStatus = useSelector((state: RootState) => state.connStatus)

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      dispatch(sendRoom({ name: roomName }))
      setRoomName('')
    }
  }

  return (
    <Space direction='horizontal' style={{ width: '97%' }}>
      <Input
        placeholder='Enter room name'
        value={roomName}
        onChange={e => setRoomName(e.target.value)}
      />
      <Button
        disabled={!roomName || connStatus === ConnStatus.Disconnected}
        type='primary'
        onClick={handleCreateRoom}
      >
        Create Room
      </Button>
    </Space>
  )
}

export default CreateRoom
