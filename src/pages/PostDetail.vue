<template>
  <div id="post-detail" class="container my-5" style="max-width: 720px">

    <div class="d-flex justify-content-end mb-3">
      <RouterLink to="/" class="btn btn-sm btn-outline-light">Back to Feed</RouterLink>
    </div>

    <div v-if="isLoading" class="text-center my-5 py-5">
      <div class="spinner-border text-accent" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="!post" class="empty-state">
      <h5 class="mb-0">Post not found.</h5>
    </div>

    <div v-else>
      <h1 class="mb-1">{{ post.title }}</h1>
      <p class="post-meta mb-4">{{ post.author }} &middot; {{ formattedDate }}</p>

      <p class="post-content mb-4">{{ post.content }}</p>

      <div class="d-flex gap-2 mb-5" v-if="canEdit || canDelete">
        <RouterLink v-if="canEdit" :to="`/editPost/${post._id}`" class="btn btn-sm btn-accent">Edit</RouterLink>
        <button v-if="canDelete" class="btn btn-sm btn-outline-danger" @click="handleDelete">Delete</button>
      </div>

      <h4 class="section-title mb-3">Comments</h4>

      <div v-if="!post.comments || post.comments.length === 0" class="empty-state mb-4">
        <p class="mb-0">No comments yet.</p>
      </div>

      <div v-else class="d-flex flex-column gap-3 mb-4">
        <div class="comment-card" v-for="comment in post.comments" :key="comment._id">
          <p class="comment-author mb-1">{{ comment.author }}</p>
          <p class="mb-0">{{ comment.comment }}</p>
        </div>
      </div>

      <div class="auth-card">
        <label class="form-label">Add a comment</label>
        <textarea class="form-control mb-3" rows="3" v-model="commentText" placeholder="Share your thoughts..."></textarea>
        <button class="btn btn-accent" :disabled="isCommenting || !commentText.trim()" @click="handleAddComment">
          {{ isCommenting ? 'Posting...' : 'Add Comment' }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

const post = ref(null)
const isLoading = ref(false)
const commentText = ref('')
const isCommenting = ref(false)

const canEdit = computed(() => !!user.profile && !!post.value && post.value.authorId === user.profile._id)
const canDelete = computed(() => canEdit.value || !!user.profile?.isAdmin)

const formattedDate = computed(() => {
  if (!post.value?.createdAt) return ''
  return new Date(post.value.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  })
})

const fetchPost = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/posts/getPost/${route.params.id}`)
    post.value = res.data
  } catch (err) {
    console.error('Failed to fetch post:', err)
    post.value = null
  } finally {
    isLoading.value = false
  }
}

const handleAddComment = async () => {
  if (!commentText.value.trim()) return
  isCommenting.value = true
  try {
    await api.patch(`/posts/addComment/${route.params.id}`, { comment: commentText.value.trim() })
    commentText.value = ''
    await fetchPost()
  } catch (err) {
    console.error('Failed to add comment:', err)
  } finally {
    isCommenting.value = false
  }
}

const handleDelete = async () => {
  const confirmed = confirm('Are you sure you want to delete this post?')
  if (!confirmed) return

  try {
    await api.delete(`/posts/deletePost/${route.params.id}`)
    router.push('/')
  } catch (err) {
    console.error('Failed to delete post:', err)
  }
}

onMounted(async () => {
  if (!user.token) {
    router.push('/login')
    return
  }
  if (!user.profile) {
    await user.fetchProfile()
  }
  fetchPost()
})
</script>
