<template>
  <div id="home" class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="brand-mark">Scriptify</div>
      <button class="btn btn-outline-light btn-sm rounded-pill px-3" @click="logout">Logout</button>
    </div>

    <RouterLink to="/addPost" class="btn btn-accent d-block py-2 fs-5 mb-4">Write a New Post</RouterLink>

    <div v-if="isLoading" class="text-center my-5 py-5">
      <div class="spinner-border text-accent" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="!posts.length && !isLoading" class="empty-state">
      <h5 class="text-center mb-0">No posts yet. Be the first to write one.</h5>
    </div>

    <div v-if="!isLoading">
      <div class="card p-4 mb-3 feed-card" v-for="post in posts" :key="post._id">
        <PostCard :post="post" :can-edit="canEdit(post)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useUserStore } from '../stores/user'
import { RouterLink, useRouter } from 'vue-router'
import PostCard from '@/components/PostCard.vue'

const user = useUserStore()
const router = useRouter()

const posts = ref([])
const isLoading = ref(false)

const fetchPosts = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/posts/getPosts')
    posts.value = res.data.posts || res.data
  } catch (err) {
    console.error('Failed to fetch posts:', err)
  } finally {
    isLoading.value = false
  }
}

const canEdit = (post) => {
  return !!user.profile && post.authorId === user.profile._id
}

const logout = () => {
  user.clearToken()
  router.push('/login')
}

onMounted(async () => {
  if (!user.token) {
    router.push('/login')
  } else {
    if (!user.profile) {
      await user.fetchProfile()
    }
    fetchPosts()
  }
})
</script>

<style scoped>
  #home {
    max-width: 700px;
  }
</style>
