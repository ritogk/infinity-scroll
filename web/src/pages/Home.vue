<script setup lang="ts">
import { useGetItems } from '@/core/api/use-get-items'

const getItems = useGetItems()
const { data } = getItems
</script>

<template>
  <div>home-page</div>
  {{ data }}
</template>

<style scoped></style>
