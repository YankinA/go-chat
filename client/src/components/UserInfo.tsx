import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '../store/types';

const UserInfo = ({ user }: { user: User }) => {
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <a href="#">Profile</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href="#">Settings</a>
            </Menu.Item>
            <Menu.Item key="3">
                <a href="#">Logout</a>
            </Menu.Item>
        </Menu>
    );

    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <Avatar icon={<UserOutlined />} />
                    <span style={{ marginLeft: '8px' }}>{user.name}</span>
                </a>
            </Dropdown>
        </div>
    );
};

export default UserInfo;
