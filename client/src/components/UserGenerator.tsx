import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Flex, Spin, message } from 'antd'
import { RootState } from '../store'
import { createUserRequest } from '../store/actions/userActions'
import { createRandomUser } from '../utils/facker'

const UserGenerator: React.FC = () => {
  const dispatch = useDispatch()
  const { loading, user, error } = useSelector(
    (state: RootState) => state.userStore
  )

  useEffect(() => {
    if (user || error) {
      return
    }
    const randomUser = createRandomUser();
    dispatch(createUserRequest(randomUser))
  }, [dispatch])

  useEffect(() => {
    if (user) {
      message.success('Личность Сгенерирована!')
    }
    if (error) {
      message.error('Ошибка генерации новой личности!')
    }
  }, [user, error])

  if (loading) {
    return (
      <Flex align='center' gap='middle'>
        <Spin size='large' tip="Мы генерируем вам новую личность. Пожалуйста, подождите..." />
      </Flex>
    )
  }

  return null
}

export default UserGenerator
