<template>
    <form @submit.prevent="updatePost" class="mb-3 d-flex flex-column gap-2">
        <label>
            <span>Title:</span>
            <input v-model="title" class="form-control" placeholder="Loading..." required />
        </label>
        <label>
            <span>Content:</span>
            <textarea
                v-model="content"
                class="form-control"
                rows="8"
                placeholder="Loading..."
                required
            ></textarea>
        </label>

        <button type="submit" class="btn btn-accent" :disabled="isLoading || !isFormValid">
            {{ isLoading ? "Saving..." : "Update" }}
        </button>

        <button type="button" class="btn btn-outline-danger" :disabled="isLoading" @click="deletePost">
            {{ isLoading ? "Deleting..." : "Delete Post" }}
        </button>

        <p class="text-danger text-center mb-0" v-if="error">{{ error }}</p>
    </form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../api";
import { useRouter } from "vue-router";

const router = useRouter()

const props = defineProps({
    id: {
        type: [String, Number],
        required: true,
    }
});

const title = ref("");
const content = ref("");

const isLoading = ref(false);
const isFormValid = ref(false);
const error = ref("");

const fetchPost = async () => {
    isLoading.value = true;
    try {
        const response = await api.get(`/posts/getPost/${props.id}`);
        title.value = response.data.title;
        content.value = response.data.content;
    } catch (err) {
        console.error("Failed to fetch post:", err);
        error.value = err.response?.data?.message || "Failed to load post.";
    } finally {
        isLoading.value = false;
    }
};

const updatePost = async () => {
    isLoading.value = true;
    error.value = "";
    try {
        await api.patch(`/posts/updatePost/${props.id}`, {
            title: title.value,
            content: content.value,
        });

        router.push("/");

    } catch (err) {
        console.error("Failed to update post:", err);
        error.value = err.response?.data?.message || "Failed to update post.";
    } finally {
        isLoading.value = false;
    }
};

const deletePost = async () => {
    isLoading.value = true;
    error.value = "";

    try {
        const confirmed = confirm('Are you sure you want to delete this post?')
        if (!confirmed) {
            isLoading.value = false;
            return
        }
        await api.delete(`/posts/deletePost/${props.id}`);
        router.push("/");

    } catch (err) {
        console.error("Failed to delete post:", err);
        error.value = err.response?.data?.message || "Failed to delete post.";
    } finally {
        isLoading.value = false;
    }
}

watch(
    [title, content],
    ([newTitle, newContent]) => {
        isFormValid.value = newTitle !== "" && newContent !== "";
    },
    { immediate: true }
);

onMounted(() => {
    fetchPost();
});
</script>
