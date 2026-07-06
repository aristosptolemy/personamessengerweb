import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import OutputIcon from '@mui/icons-material/Output';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

import ChatIcon from '@mui/icons-material/Chat';

const userData = localStorage.getItem('userData')

const userID = userData ? JSON.parse(userData).id : null

export const Lists = [
  {
    link: '/friend-list',
    name: 'フレンド一覧',
    icon: <GroupIcon />
  },
  {
    link: '/chat-rooms',
    name: 'チャットルーム一覧',
    icon: <ChatIcon />
  },
  {
    link: '/friend-search',
    name: 'ユーザー検索',
    icon: <PersonSearchIcon />
  },
  {
    link: '/request-list',
    name: 'フレンドリクエスト',
    icon: <ConnectWithoutContactIcon />
  },
  {
    link: `/user-setting/${userID}`,
    name: 'ユーザー設定',
    icon: <ManageAccountsIcon />
  }
]