import localeCommon from './en-US/common';
import localeButton from './en-US/button'
import login from '@/views/login/locale/en-US';
import localeSettings from './en-US/settings';
import localeMenu from './en-US/menu';
import localeNavbar from './en-US/navbar';
import localeTag from './en-US/tag';
import localeSysMenu from '@/views/system/menu/locale/en-US';
import localeSysUser from '@/views/system/user/locale/en-US';
import localeSysRole from '@/views/system/role/locale/en-US';
import localeSysClient from '@/views/system/client/locale/en-US';

export default {
  ...localeCommon,
  ...localeButton,
  ...login,
  ...localeSettings,
  ...localeMenu,
  ...localeNavbar,
  ...localeTag,
  ...localeSysMenu,
  ...localeSysUser,
  ...localeSysRole,
  ...localeSysClient,
};