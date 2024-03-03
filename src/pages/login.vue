<script setup>
import logo from '@images/logo.svg?raw'
import { email, helpers, minLength, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { request } from "@/js/utils/actions/request";
import { useUserStore } from "@/store/user";
import { endpoints } from "@/js/utils/actions/endpoints";
import { useToast } from "vue-toastification";
import {useI18n} from "vue-i18n/dist/vue-i18n";
import SSEContactsInstance from "@/js/utils/actions/sse/contacts";

const storeUser = useUserStore()
const toast = useToast();

const router = useRouter()
const form = reactive({
  email: '',
  password: '',
})

const isPasswordVisible = ref(false)
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
}
const v$ = useVuelidate(rules, form)
const login = async () => {
  for (const key in rules) {
    v$.value[key].$validate();
  }
  if (!v$.value.$error) {
    isLoading.value = true;
    try {
      const res = await request.post(endpoints.auth.LOGIN, {
        email: form.email,
        password: form.password
      });
      if (res.status === 200) {
        storeUser.setUser(res.data);
        await SSEContactsInstance.notificationEventSource();
        await router.push({ name: 'contacts' })
      }
    } catch (e) {
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

      <VCardText>
        <VForm @submit.prevent="login">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                required
                :error-messages="v$.email.$errors.map(e => getI18n(e.$message, 'Неправильный Email'))"
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
                v-model="form.email"
                placeholder="johndoe@email.com"
                label="Email"
                type="email"
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
                label="Пароль"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <!-- remember me checkbox -->
              <!--              <div class="d-flex align-center justify-end flex-wrap mt-1 mb-4">
                              <RouterLink
                                class="text-primary ms-2 mb-1"
                                to="javascript:void(0)"
                              >
                                Forgot Password?
                              </RouterLink>
                            </div>-->

              <!-- login button -->
              <VBtn
                block
                type="submit"
                class="mt-4"
                :disabled="v$.$error || isLoading"
              >
                {{ $t('actions.login') }}
              </VBtn>
            </VCol>

            <!-- create account -->
            <VCol
              cols="12"
              class="text-center text-base"
            >
              <span>{{ $t('form.firstVisit') }}</span>
              <RouterLink
                class="text-primary ms-2"
                to="/register"
              >
                {{ $t('actions.createAccount') }}
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
