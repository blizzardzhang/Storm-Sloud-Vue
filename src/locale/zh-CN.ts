import localeCommon from './zh-CN/common';
import localeButton from './zh-CN/button';
import login from '@/views/login/locale/zh-CN'
import localeSettings from './zh-CN/settings';
import localeMenu from './zh-CN/menu';
import localeNavBar from './zh-CN/navbar';
import localeTag from './zh-CN/tag';
import localeSysMenu from '@/views/system/menu/locale/zh-CN';
import localeSysUser from '@/views/system/user/locale/zh-CN';
import localeSysRole from '@/views/system/role/locale/zh-CN';
import localeSysClient from '@/views/system/client/locale/zh-CN';
import localeSysOss from '@/views/resource/oss/locale/zh-CN';
import localeSiteArtiCategory from '@/views/site/arti-category/locale/zh-CN';
import localeSiteArtiTag from '@/views/site/arti-tags/locale/zh-CN';


export default {
 ...localeCommon,
 ...localeButton,
 ...login,
 ...localeSettings,
 ...localeMenu,
 ...localeNavBar,
 ...localeTag,
 ...localeSysMenu,
 ...localeSysUser,
 ...localeSysRole,
 ...localeSysClient,
 ...localeSysOss,
 ...localeSiteArtiCategory,
 ...localeSiteArtiTag,
}