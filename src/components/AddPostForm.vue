<template>
    <form @submit.prevent="addPost" class="mb-3 d-flex flex-column gap-2">
        <label>
            <span>Title:</span>
            <input
                v-model="title"
                class="form-control"
                placeholder="Enter post title..."
                required
            />
        </label>
        <label>
            <span>Content:</span>
            <textarea
                v-model="content"
                class="form-control"
                rows="8"
                placeholder="Write your post..."
                required
            ></textarea>
        </label>

        <button class="btn btn-accent" :disabled="isLoading || !isFormValid">
            {{ isLoading ? "Publishing..." : "Publish" }}
        </button>
    </form>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "../api";
import { useRouter } from "vue-router";

const router = useRouter();

const title = ref("");
const content = ref("");

const isFormValid = ref(false);
const isLoading = ref(false);

watch(
    [title, content],
    ([newTitle, newContent]) => {
        isFormValid.value = newTitle !== "" && newContent !== "";
    },
    { immediate: true }
);

const addPost = async () => {
    try {
        isLoading.value = true;

        await api.post("/posts/addPost", {
            title: title.value,
            content: content.value,
        });

        title.value = "";
        content.value = "";

        router.push("/");

    } catch (error) {
        console.error("Failed to add post:", error);
    } finally {
        isLoading.value = false;
    }
};
</script>
