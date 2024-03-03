<script setup>
import logo from '@images/logo.svg?raw'
import { useVuelidate } from '@vuelidate/core'
import { email, helpers, minLength, required } from '@vuelidate/validators'
import { request } from '@/js/utils/actions/request';
import { phoneMask } from "@/js/utils/ui/phoneHelper";
import { Mask } from "maska";
import { endpoints } from "@/js/utils/actions/endpoints";
import { useToast } from "vue-toastification";
import {useI18n} from "vue-i18n/dist/vue-i18n";

const router = useRouter();
const toast = useToast();
const mask = new Mask({ mask: phoneMask })

const form = reactive({
  email: '',
  phone: '',
  password: '',
  privacyPolicies: false,
})
const test = {
  $validator: (value) => value !== '123456789',
  $message: 'value must not be equal to 123456789',
  $params: {
    type: 'test'
  }
}
const {t} = useI18n()
const rules = {
  email: {
    required: helpers.withMessage('data.helpers.emailRequired', required),
    email: helpers.withMessage('data.helpers.errorEmail', email)
  },
  password: {
    required: helpers.withMessage('data.helpers.errorPass', required),
    minLength: helpers.withMessage('data.helpers.errorPassLength', minLength(8))
  },
  phone: {
    required: helpers.withMessage('data.helpers.errorPhone', required),
    minLength: helpers.withMessage('data.helpers.errorPhone', minLength(11))
  }
}
const v$ = useVuelidate(rules, form)

const maskPhoneNumber = (e) => {
  v$.value.phone.$touch(e);
  form.phone = mask.masked(form.phone)
}

const isPasswordVisible = ref(false)

const register = async () => {
  for (const key in rules) {
    v$.value[key].$validate();
  }
  if (!v$.value.$error) {
    isLoading.value = true;
    const res = await request.post(endpoints.auth.REGISTRATION, {
      email: form.email,
      password: form.password,
      phone: `7${mask.unmasked(form.phone)}`
    });
    if (res.status === 201) {
      toast.success(t('notifications.registrationSuccess'))
      await router.push({ name: 'login' })
    }
    isLoading.value = false;
  }
}

const isLoading = ref(false);

const getI18n = (m, defaultText) => {
  const message = t(m)
  return message === m ? defaultText : message
}
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-4 pt-7"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <template #prepend>
          <div class="d-flex">
            <div
              class="d-flex text-primary"
              v-html="logo"
            />
          </div>
        </template>

        <VCardTitle class="text-2xl font-weight-bold">
          IVR
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5">
          {{ $t('actions.register') }}
        </h5>
      </VCardText>

      <VCardText>
        <VForm @submit.prevent="register">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                required
                :error-messages="v$.email.$errors.map(e => getI18n(e.$message, 'Неправильный Email'))"
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
                v-model="form.email"
                label="Email"
                placeholder="johndoe@email.com"
                type="email"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                required
                :error-messages="v$.phone.$errors.map(e => getI18n(e.$message, 'Телефон обязателен'))"
                @input="maskPhoneNumber"
                @blur="v$.phone.$touch"
                v-model="form.phone"
                :label="getI18n('table.phone', 'Телефон')"
                v-maska
                data-maska="#-#"
                placeholder="+7 (999) 999 9999"
                type="phone"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                required
                :error-messages="v$.password.$errors.map(e => getI18n(e.$message, 'Неправильный пароль'))"
                @input="v$.password.$touch"
                @blur="v$.password.$touch"
                v-model="form.password"
                :label="getI18n('form.password', 'Пароль')"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <!--              <div class="d-flex align-center mt-1 mb-4">
                              <VCheckbox
                                id="privacy-policy"
                                v-model="form.privacyPolicies"
                                inline
                              />
                              <VLabel
                                for="privacy-policy"
                                style="opacity: 1;"
                              >
                                <span class="me-1">I agree to</span>
                                <a
                                  href="javascript:void(0)"
                                  class="text-primary"
                                >privacy policy & terms</a>
                              </VLabel>
                            </div>-->

              <VBtn
                block
                :disabled="v$.$error || isLoading"
                type="submit"
                class="mt-6"
              >
                {{ $t('actions.register') }}
              </VBtn>
            </VCol>

            <!-- login instead -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>{{ $t('form.alreadyHaveAcc') }}</span>
              <RouterLink
                class="text-primary ms-2"
                to="/login"
              >
                {{ $t('actions.login') }}
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
