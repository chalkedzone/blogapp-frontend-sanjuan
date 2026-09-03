<template>
    <div id="add-post" class="mx-auto my-5 px-2">
        <h1 class="text-center">Write a New Post</h1>
        <div class="d-flex justify-content-end">
            <RouterLink to="/" class="btn btn-sm btn-outline-light mb-3">Go back</RouterLink>
        </div>
        <AddPostForm />
    </div>
</template>

<script setup>
import AddPostForm from '@/components/AddPostForm.vue';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const user = useUserStore()
const router = useRouter()

onMounted(() => {
  if (!user.token) {
    router.push('/login')
  }
})
</script>

<style scoped>
  #add-post {
    max-width: 700px;
  }
</style>
