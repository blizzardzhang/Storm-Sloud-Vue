<template>
  <a-form
    ref="formRef"
    :class="['item-container', `login-${type}`]"
    :model="formData"
    @submit="onSubmit"
    :rules="FORM_RULES"
    :label-col-props="{ span: 0 }"
    :wrapper-col-styles="{ span: 24 }"
  >
    <!--    密码登录-->
    <template v-if="type === 'password'">
      <a-form-item field="account" validate-trigger="blur">
        <a-input
          class="input"
          v-model="formData.account"
          size="large"
          :placeholder="`${$t('pages.login.input.account')}：admin`"
        >
          <template #prefix>
            <IconUser />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="password" validate-trigger="blur">
        <a-input-password
          class="input"
          v-model="formData.password"
          size="large"
          allowClear
          :placeholder="`${$t('pages.login.input.password')}：code-storm`"
        >
          <template #prefix>
            <IconLock />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="check-container remember-pwd">
        <a-checkbox>{{ $t("pages.login.remember") }}</a-checkbox>
        <span class="tip">{{ $t("pages.login.forget") }}</span>
      </div>
    </template>
    <!--    扫码登录-->
    <template v-else-if="type === 'qrcode'">
      <div class="tip-container">
        <span class="tip">{{ $t("pages.login.wechatLogin") }}</span>
        <span class="refresh"
          >{{ $t("pages.login.refresh") }} <IconRefresh class="refresh-icon" />
        </span>
      </div>
      <qrcode-vue value="" :size="160" level="H" />
    </template>

    <!--    手机号登录-->
    <template v-else>
      <a-form-item field="phone" validate-trigger="blur">
        <a-input
          class="input"
          v-model="formData.phone"
          size="large"
          :placeholder="`${$t('pages.login.input.phone')}：18687316214`"
        >
          <template #prefix>
            <IconPhone />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item class="verification-code">
        <a-input
          class="input"
          v-model="formData.verifyCode"
          size="large"
          :placeholder="$t('pages.login.input.verification')"
        />
        <a-button size="large" :disabled="countDown > 0" @click="sendCode">
          {{
            countDown == 0
              ? $t("pages.login.sendVerification")
              : `${countDown}秒后可重发`
          }}
        </a-button>
      </a-form-item>
    </template>

    <!--    登录按钮-->
    <a-form-item v-if="type !== 'qrcode'" class="btn-container">
      <a-button
        long
        type="primary"
        size="large"
        class="submit-btn"
        @click="onSubmit"
        >{{ $t("pages.login.signIn") }}
      </a-button>
    </a-form-item>

    <!--    切换登录方式-->
    <div class="switch-container">
      <span
        v-if="type !== 'password'"
        class="tip"
        @click="switchType('password')"
        >{{ $t("pages.login.accountLogin") }}</span
      >
      <span
        v-if="type !== 'qrcode'"
        class="tip"
        @click="switchType('qrcode')"
        >{{ $t("pages.login.wechatLogin") }}</span
      >
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">{{
        $t("pages.login.phoneLogin")
      }}</span>
    </div>
  </a-form>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import { type FieldRule, type ValidatedError } from "@arco-design/web-vue";
import {ref } from "vue";
import QrcodeVue from "qrcode.vue";
import { useCounter } from "@/hooks/counter";
import router from "@/router";
import { useUserStore } from "@/store";
import useLoading from "@/hooks/loading.ts";

const { t } = useI18n();

const FORM_RULES: Record<string, FieldRule[]> = {
  phone: [{ required: true, message: t("pages.login.required.phone") }],
  account: [{ required: true, message: t("pages.login.required.account") }],
  password: [{ required: true, message: t("pages.login.required.password") }],
  verifyCode: [
    { required: true, message: t("pages.login.required.verification") },
  ],
};

//登录类型
const type = ref("password");

const formRef = ref();

const switchType = (val: string) => {
  type.value = val;
};

const INITIAL_DATA = {
  phone: "",
  clientId: "storm-pc",
  grantType: "password",
  account: "admin",
  password: "admin",
  verifyCode: "",
  checked: false,
};

const formData = ref({ ...INITIAL_DATA });
const [countDown, handleCounter] = useCounter();
const userStore = useUserStore();
const { loading, setLoading } = useLoading();

const errorMessage = ref("");

/**
 * 发送验证码
 */
const sendCode = async () => {
  formRef.value.validate({ fields: ["phone"] });
  const validate = await formRef.value.validate({ fields: ["phone"] });
  if (validate) return false;
  handleCounter();
};


//登录按钮
const onSubmit = async ({
  errors,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      const params = {
        clientId: formData.value.clientId,
        grantType: formData.value.grantType,
        account: formData.value.account,
        password: formData.value.password,
      };
      // 登录
      await userStore.login(params);
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      router.push({
        name: (redirect as string) || "Info",
        query: {
          ...othersQuery,
        },
      });
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {
      setLoading(false);
    }
  }
};
</script>

<style scoped lang="less">
@import "../index.less";
</style>
