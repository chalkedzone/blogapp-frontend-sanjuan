<template>
    <div id="edit-post" class="mx-auto my-5 px-2">
        <h1 class="text-center">Edit Post</h1>
        <div class="d-flex justify-content-end">
            <RouterLink to="/" class="btn btn-sm btn-outline-light mb-3">Go back</RouterLink>
        </div>
        <EditPostForm :id="id" />
    </div>
</template>

<script setup>
import EditPostForm from "@/components/EditPostForm.vue";
import { useUserStore } from "@/stores/user";
import { onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

const user = useUserStore()
const router = useRouter()

const route = useRoute();
const id = route.params.id;

onMounted(() => {
  if (!user.token) {
    router.push('/login')
  }
})
</script>

<style scoped>
#edit-post {
    max-width: 700px;
}
</style>
