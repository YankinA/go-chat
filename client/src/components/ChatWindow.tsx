import { Input, Button, Flex } from 'antd'
import { useState } from 'preact/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { List } from 'antd'
import { sendMessage } from '../store/actions/messageActions'
import { UserOutlined } from '@ant-design/icons'
import { ConnStatus } from '../store/types'

const ChatWindow = ({ roomId }: { roomId: string }) => {
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()
  const messages = useSelector((state: RootState) =>
    state.messageStore.messages.filter(c => c.roomId === roomId)
  )
  const user = useSelector((state: RootState) => state.userStore.user)
  const connStatus = useSelector((state: RootState) => state.connStatus)

  const handleSendMessage = () => {
    dispatch(sendMessage({ roomId, userId: user.id, text: message }))
    setMessage('')
  }

  return (
    <Flex
      vertical
      style={{ height: '100vh', position: 'relative', overflowY: 'auto' }}
    >
      <Flex className='messages' vertical>
        <List
          className='comment-list'
          header={<div>{`${messages.length} сообщений`}</div>}
          itemLayout='horizontal'
          dataSource={messages}
          style={{padding: '60px', }}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<UserOutlined />}
                title={item.user.name}
                description={item.text}
              />
              <div>{new Date(item.createdAt).toLocaleString()}</div>
            </List.Item>
          )}
        />
      </Flex>
      <Flex
        className='messages'
        style={{
          height: '50px',
          position: 'fixed',
          bottom: '20px',
          left: '290px',
          right: '30px'
        }}
      >
        <Input
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder='Type your message...'
          style={{ height: '40px' }}
        />
        <Button
          disabled={connStatus === ConnStatus.Disconnected}
          onClick={handleSendMessage}
          style={{ height: '40px' }}
        >
          Send
        </Button>
      </Flex>
    </Flex>
  )
}

export default ChatWindow
