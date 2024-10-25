import { Flex, Menu } from 'antd'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import CreateRoom from './CreateRoom'

const RoomList = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const rooms = useSelector((state: RootState) => state.roomStore.rooms)

  return (
    <Menu
      mode='inline'
      style={{ height: '100vh', paddingTop: '20px', top: 0, bottom: 0, overflowY: 'auto' }}
      onClick={e => onSelect(e.key)}
    >
      <CreateRoom />
      {rooms.map(room => (
        <Menu.Item key={room.id}>
          <Flex
            style={{ minHeight: '40px', width: '100%' }}
            justify={'space-between'}
            align='center'
          >
            <div>
              <strong>{room.name}</strong>
            </div>
            <div
              style={{
                maxWidth: '200px',
                paddingLeft: "5px",
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {room?.lastMessage && (
                <p>{room.lastMessage.user.name}: {room.lastMessage.text}</p>
              )}
            </div>
          </Flex>
        </Menu.Item>
      ))}
    </Menu>
  )
}

export default RoomList
