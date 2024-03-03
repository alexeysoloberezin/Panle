<script setup>
import avatar from '@images/avatars/user.svg';
import { useUserStore } from "@/store/user";
import { request } from "@/js/utils/actions/request";
import { endpoints } from "@/js/utils/actions/endpoints";
import { useTheme } from "vuetify";
import {closeAllSSE} from "@/js/utils/actions/sse/seeMain";

const router = useRouter();
const userStore = useUserStore()
const {
  name: themeName,
} = useTheme()
const logout = async () => {
  await request.post(endpoints.auth.LOGOUT);
  userStore.clearUser();
  closeAllSSE();
  await router.push({ name: 'login' })
}

</script>

<template>
  <VAvatar
    class="cursor-pointer"
    color="primary"
    variant="tonal"
  >
    <VImg :src="avatar" :class="{'dark-icon': themeName === 'dark'}"/>
    <!-- SECTION Menu -->
    <VMenu
      activator="parent"
      width="230"
      location="bottom end"
      offset="14px"
    >
      <VList>
        <!-- 👉 User Avatar & Name -->
        <!--        <VListItem>
                  <template #prepend>
                    <VListItemAction start>
                      <VBadge
                        dot
                        location="bottom right"
                        offset-x="3"
                        offset-y="3"
                        color="success"
                      >
                        <VAvatar
                          color="primary"
                          variant="tonal"
                        >
                          <VImg :src="avatar"/>
                        </VAvatar>
                      </VBadge>
                    </VListItemAction>
                  </template>

                  <VListItemTitle class="font-weight-semibold">
                    John Doe
                  </VListItemTitle>
                  <VListItemSubtitle>Admin</VListItemSubtitle>
                </VListItem>-->
        <!--<VDivider class="my-2"/>-->

        <!-- 👉 Profile -->
        <!--        <VListItem to="/account-settings">
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="bx-user"
                      size="22"
                    />
                  </template>

                  <VListItemTitle>Profile</VListItemTitle>
                </VListItem>-->

        <!-- 👉 Settings -->
        <!--        <VListItem to="/account-settings">
                  <template #prepend>
                    <VIcon
                      class="me-2"
                      icon="bx-cog"
                      size="22"
                    />
                  </template>

                  <VListItemTitle>Settings</VListItemTitle>
                </VListItem>-->

        <!-- Divider -->
        <!--<VDivider class="my-2"/>-->

        <!-- 👉 Logout -->
        <VListItem @click="logout">
          <template #prepend>
            <VIcon
              class="me-2"
              icon="bx-log-out"
              size="22"
            />
          </template>

          <VListItemTitle>{{ $t('actions.exit') }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
    <!-- !SECTION -->
  </VAvatar>
</template>

<style scoped>
.dark-icon {
  background-color: #fff;
}
</style>
