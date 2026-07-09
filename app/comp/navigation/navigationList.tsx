import GroupIcon from '@mui/icons-material/Group';

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import PersonSearchIcon from '@mui/icons-material/PersonSearch';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

import ChatIcon from '@mui/icons-material/Chat';

export const Lists = [
  {
    link: '/friend-list',
    name: 'フレンド一覧',
    icon: <GroupIcon />
  },
  {
    link: '/friend-search',
    name: 'ユーザー検索',
    icon: <PersonSearchIcon />
  },
  {
    link: '/chat-rooms',
    name: 'チャットルーム一覧',
    icon: <ChatIcon />
  },
  {
    link: '/room-create',
    name: 'ルーム作成',
    icon: <AddCircleIcon />
  },
  {
    link: '/request-list',
    name: 'フレンドリクエスト',
    icon: <ConnectWithoutContactIcon />
  },
  {
    link: `/user-setting`,
    name: 'ユーザー設定',
    icon: <ManageAccountsIcon />
  }
]