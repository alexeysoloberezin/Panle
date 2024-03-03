<script setup>
import { useTheme } from 'vuetify'
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import upgradeBannerDark from '@images/pro/upgrade-banner-dark.png'
import upgradeBannerLight from '@images/pro/upgrade-banner-light.png'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import BalanceBox from "@/components/Balance/BalanceBox.vue";
import Notifications from "@/components/Notifications.vue";
import LocalSelect from "@/plugins/i18_ui/components/LocalSelect.vue";
import {useUserStore} from "@/store/user";

const vuetifyTheme = useTheme()

const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
})

const isAdmin = computed(() => {
  return useUserStore().isAdmin
})
</script>

<template>
  <VerticalNavLayout>
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 Vertical nav toggle in overlay mode -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="bx-menu"/>
        </IconBtn>

        <VSpacer/>

        <LocalSelect />

        <Notifications />

        <BalanceBox />

        <NavbarThemeSwitcher class="me-2"/>

        <UserProfile/>
      </div>
    </template>

    <template #vertical-nav-content>
      <VerticalNavLink
        :item="{
          title: $t('pages.company'),
          icon: 'bx-home',
          to: '/campaign',
        }"
      />
      <VerticalNavLink
        :item="{
          title: $t('pages.audioClips'),
          icon: 'bx-headphone',
          to: '/audioclips',
        }"
      />
      <VerticalNavLink
        :item="{
          title: $t('pages.contacts'),
          icon: 'bx-data',
          to: '/contacts',
        }"
      />
      <VerticalNavLink
        :item="{
          title: $t('pages.scenarios'),
          icon: 'bx-phone-call',
          to: '/scenarios',
        }"
      />
      <VerticalNavLink
        text-hover="Функционал будет доступен в следующих версиях продукта"
        :item="{
          disable: true,
          title: $t('pages.plan'),
          icon: 'bx-time',
          to: '/',
        }"
      />
      <VerticalNavLink
        :item="{
          disable: false,
          title: $t('pages.prices'),
          icon: 'bx-calculator',
          to: '/prices',
        }"
      />
      <VerticalNavLink
        :item="{
          title: $t('pages.statistics'),
          icon: 'bx-line-chart',
          to: '/statistics',
        }"
      />
      <VerticalNavLink
        v-if="isAdmin"
        :item="{
          title: $t('pages.adminPanel'),
          icon: 'bx-shield-alt-2',
          to: '/adminPanel',
        }"
      />
    </template>

    <template #after-vertical-nav-items>
    </template>

    <!-- 👉 Pages -->
    <slot/>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer/>
    </template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
