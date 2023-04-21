<template>
  <div class="flex flex-col  overflow-hidden h-screen">
    <NavBar />
    <div class="flex-grow overflow-y-scroll">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
