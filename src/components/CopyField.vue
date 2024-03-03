<template>
  <div class="copyField" :class="copied ? 'copied' : ''">
    <div class="copyField-wrp">
      <v-text-field :model-value="value" :label="label" :readonly="true"></v-text-field>
      <v-btn @click="copyText" class="copyField-copy"
             style="min-width: 32px;width: 32px;min-height: 32px;height: 32px;">
        <svg class="" style="width: 18px;" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>
          content-copy</title>
          <path
            d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
        </svg>
      </v-btn>
    </div>

    <TooltipInfo
      :isModern="true"
      :is-modern-id="fieldId"
    >
      <template #modernTooltip>
        <slot name="tooltip"></slot>
      </template>
    </TooltipInfo>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TooltipInfo from "@/components/TooltipInfo.vue";

const props = defineProps(['value', 'label', 'fieldId']);
const label = ref(props?.label || 'Curl для добавления базы')
const copied = ref(false);

const copyText = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(props.value)
      .then(() => {
        copied.value = true;
        // Reset the copied state after a short delay
        setTimeout(() => {
          copied.value = false;
        }, 1500);
      })
      .catch(err => {
        console.log('Something went wrong', err);
      });
  } else {
    const textField = document.createElement('textarea');
    textField.value = props.value;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    document.body.removeChild(textField);

    copied.value = true;
    // Reset the copied state after a short delay
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  }
}
</script>

<style lang="scss">
.copyField {
  display: flex;
  gap: 10px;

  &-wrp {
    position: relative;
    display: flex;
    width: 100%;
  }

  .v-field__input {
    min-height: 41px;
    padding-right: 60px;
  }

  .copyField-copy {
    position: absolute;
    top: 50%;
    z-index: 10;
    transform: translateY(-50%);
    right: 10px;
  }

  // Add a style for feedback when the text is copied
  &.copied {
    .copyField-copy {
      background-color: #4caf50 !important; // Green color for feedback
    }
  }
}
</style>
