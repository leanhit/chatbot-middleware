<script lang="ts" src="@/scripts/login.ts"></script>

<template>
    <div id="app">
        <div class="login-page">
            <transition name="fade">
                <div class="wallpaper-login"></div>
            </transition>

            <div class="container">
                <div class="row">
                    <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
                        <div class="card login" :class="{ error: emptyFields }">
                            <h1>{{ isLoginView ? '' : '' }}</h1>
                            <form class="form-group" @submit.prevent="isLoginView ? doLogin() : doRegister()">
                                <input
                                    v-model="emailLogin"
                                    type="email"
                                    class="form-control"
                                    placeholder="Email"
                                    required />
                                <input
                                    v-model="passwordLogin"
                                    type="password"
                                    class="form-control"
                                    placeholder="Password"
                                    required />
                                <transition name="fade">
                                    <input
                                        v-if="!isLoginView"
                                        v-model="emailConfirm"
                                        type="email"
                                        class="form-control"
                                        placeholder="Confirm Email"
                                        required />
                                </transition>
                                <input
                                    type="submit"
                                    class="btn btn-primary"
                                    :value="isLoginView ? 'Sign In' : 'Register'" />

                                <p>
                                    <span v-if="isLoginView">
                                        Don't have an account?
                                        <a href="#" @click.prevent="toggleView" class="text-blue-600 hover:underline">
                                            Register
                                        </a>
                                        &nbsp;here
                                    </span>
                                    <span v-else>
                                        Already have an account?
                                        <a href="#" @click.prevent="toggleView" class="text-blue-600 hover:underline">
                                            Login
                                        </a>
                                        &nbsp;here
                                    </span>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/styles/login.scss';
</style>
