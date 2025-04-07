<template>
  <div
    v-show="show"
    class="absolute top-3 right-3 p-4 text-sm text-black rounded-lg bg-white w-1/4 min-h-1/7"
  >
    <button
      type="button"
      class="absolute top-3 end-3 inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-hidden focus:opacity-100 dark:text-white cursor-pointer"
      aria-label="Close"
      @click="emit('close')"
    >
      <span class="sr-only">Close</span>
      <svg
        class="shrink-0 size-4"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
    <div>
      <strong>Текущий адрес:</strong><br />
      {{ address }}
    </div>
    <div><strong>Расстояние:</strong> {{ distance }}км</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  address: string;
  distance: string;
}>();
const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>
