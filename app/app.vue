<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Calculadora Visual de Fracciones'
const description = 'Calculadora visual para sumar y restar fracciones usando figuras geométricas. Diseñada para facilitar la comprensión de las fracciones mediante representaciones gráficas interactivas.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,

})
</script>

<template>
  <UApp>


    <UMain>
      <NuxtPage />
    </UMain>


  </UApp>
</template>
