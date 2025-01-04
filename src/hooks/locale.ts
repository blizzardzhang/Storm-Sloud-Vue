import { computed } from 'vue';
import { useI18n} from 'vue-i18n';
import { Message } from '@arco-design/web-vue';

export default function useLocale() {
  const i18n = useI18n();
  const currentLocale = computed(() => {
    return i18n.locale.value;
  });
  const changeLocale = (value: string) => {
    if (i18n.locale.value === value) {
      return;
    }
    i18n.locale.value = value;
    localStorage.setItem('arco-locale', value);
    Message.success(i18n.t('navbar.action.locale'));
  }
  return {
    currentLocale,
    changeLocale,
  }
}