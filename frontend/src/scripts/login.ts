import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { usersApi } from '@/api/usersApi';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth';

export default {
    props: ['viewSettings'],
    emits: ['onChangeView'],
    setup(props: any, context: any) {
        const { t } = useI18n();

        const emailLogin = ref('');
        const passwordLogin = ref('');
        const passwordConfirm = ref('');
        const emptyFields = ref(false);
        const isLoginView = ref(true);
        const showPassword = ref(false);
        const showPasswordConfirm = ref(false);

        const router = useRouter();
        const authStore = useAuthStore();

        function toggleView() {
            isLoginView.value = !isLoginView.value;
            emailLogin.value = '';
            passwordLogin.value = '';
            passwordConfirm.value = '';
            emptyFields.value = false;
        }

        function isValidEmail(email: string) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        function doLogin() {
            if (!emailLogin.value || !passwordLogin.value) {
                alert('Please fill in all fields');
                emptyFields.value = true;
                return;
            }

            if (!isValidEmail(emailLogin.value)) {
                ElMessage.error('Invalid email format.');
                return;
            }

            usersApi
                .login({ email: emailLogin.value, password: passwordLogin.value })
                .then((response) => {
                    if (response.status === 200) {
                        const { token, user } = response.data;
                        authStore.login(token, user);
                        router.push('/');
                    } else {
                        ElMessage.error(`Oops, ${response.data.message}`);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    ElMessage.error('Login failed. Please check your credentials.');
                });
        }

        function doRegister() {
            if (!emailLogin.value || !passwordLogin.value || !passwordConfirm.value) {
                alert('Please fill in all fields');
                emptyFields.value = true;
                return;
            }

            if (!isValidEmail(emailLogin.value)) {
                ElMessage.error('Invalid email format.');
                return;
            }

            if (passwordLogin.value !== passwordConfirm.value) {
                ElMessage.error('Emails do not match.');
                return;
            }

            const data = {
                email: emailLogin.value,
                password: passwordLogin.value,
            };

            usersApi
                .register(data)
                .then((response) => {
                    if (response.status === 201) {
                        ElMessage.success('Registered successfully. Please log in.');
                        toggleView();
                    } else {
                        ElMessage.error(`Oops, ${response.data.message}`);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    ElMessage.error('Registration failed. Please try again.');
                });
        }

        function toggleShowPassword() {
            showPassword.value = !showPassword.value;
        }

        function toggleShowPasswordConfirm() {
            showPasswordConfirm.value = !showPasswordConfirm.value;
        }

        return {
            t,
            emailLogin,
            passwordLogin,
            passwordConfirm,
            emptyFields,
            isLoginView,
            toggleView,
            doLogin,
            doRegister,
            toggleShowPassword,
            toggleShowPasswordConfirm,
            showPassword,
            showPasswordConfirm,
        };
    },
};
