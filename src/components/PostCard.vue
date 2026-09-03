<template>
    <div class="d-flex justify-content-between align-items-start">

        <div class="flex-grow-1">
            <h4 class="fw-bolder post-title">{{ post.title }}</h4>
            <h6 class="post-meta">{{ post.author }} &middot; {{ formattedDate }}</h6>
            <p class="post-excerpt">{{ excerpt }}</p>
        </div>

        <div class="d-flex flex-column gap-2 ms-3">
            <RouterLink :to="`/posts/${post._id}`" class="btn btn-sm btn-outline-accent">
                Read
            </RouterLink>
            <RouterLink v-if="canEdit" :to="`/editPost/${post._id}`" class="btn btn-sm btn-accent">
                Edit
            </RouterLink>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    post: Object,
    canEdit: Boolean
})

const excerpt = computed(() => {
    if (!props.post.content) return ''
    return props.post.content.length > 140
        ? props.post.content.slice(0, 140).trim() + '...'
        : props.post.content
})

const formattedDate = computed(() => {
    if (!props.post.createdAt) return ''
    return new Date(props.post.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    })
})
</script>
