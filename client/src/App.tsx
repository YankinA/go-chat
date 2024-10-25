import { useState } from 'preact/hooks'
import { Empty, Layout, message, Typography } from 'antd'
import RoomList from './components/RoomList'
import ChatWindow from './components/ChatWindow'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'preact/hooks'
import { connectToSocket } from './socket'
import { RootState } from './store'
import UserGenerator from './components/UserGenerator'
import { fetchRoomsRequest } from './store/actions/roomActions'
import UserInfo from './components/UserInfo'
import { ConnStatus } from './store/types'

const { Sider, Content } = Layout

const App = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const connSuccess = () => {
    messageApi.open({
      type: 'success',
      content: "Соединение восстановлено. Интернет решил вернуться к работе",
    });
  };

  const connError = () => {
    messageApi.open({
      type: 'error',
      content: 'Соединение потерялось в пространстве и времени',
    });
  };

  
  const [room, selectRoom] = useState<string | null>(null)
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.userStore.user)

  const connStatus = useSelector((state: RootState) => state.connStatus)

  useEffect(() => {
    if (connStatus === ConnStatus.Disconnected) {
      connError()
    }
  }, [connStatus])

  useEffect(() => {
    if (user) {
      dispatch(fetchRoomsRequest())
      connectToSocket(user.id)
    }

    const handleOnline = () => {
      if (user) {
        connectToSocket(user.id)
        connSuccess()
      }
    }

    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [user, dispatch])

  if (!user) {
    return <UserGenerator />
  }

  return (
    <>
    {contextHolder}
    <Layout style={{ height: '100vh' }}>
      <UserInfo user={user} />
      <Sider width={250} style={{   }}>
        <RoomList onSelect={id => selectRoom(id)} />
      </Sider>
      <Content>
        {room ? (
          <ChatWindow roomId={room} />
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}
          >
            <Empty description='Select a chat room to start messaging' />
          </div>
        )}
      </Content>
    </Layout>
    </>
  )
}

export default App
