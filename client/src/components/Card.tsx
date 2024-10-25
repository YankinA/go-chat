import { Card as AntCard, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Card = ({ title, text, Icon = UserOutlined }) => {
  return (
    <AntCard  style={{ width: 300, margin: '16px 4px 0 4px' }}>
      <AntCard.Meta
        avatar={<Avatar icon={<Icon />} />}
        title={<Text strong>{title}</Text>}
        description={text}
      />
    </AntCard>
  );
};

export default Card;
