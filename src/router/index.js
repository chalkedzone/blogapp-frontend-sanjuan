import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import AddPost from '../pages/AddPost.vue'
import EditPost from '../pages/EditPost.vue'
import PostDetail from '../pages/PostDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/addPost', name: 'AddPost', component: AddPost, meta: { requiresAuth: true } },
  { path: '/editPost/:id', name: 'EditPost', component: EditPost, meta: { requiresAuth: true } },
  { path: '/posts/:id', name: 'PostDetail', component: PostDetail, meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
