<template>
  <div class="flex flex-col overflow-hidden h-[calc(100dvh)]">
    <NavBar />
    <div class="flex-grow overflow-y-scroll">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
