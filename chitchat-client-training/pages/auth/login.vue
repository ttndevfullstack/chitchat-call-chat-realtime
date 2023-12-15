<script lang="ts" setup>
definePageMeta({
  layout: 'empty',
  auth: {
    unauthenticatedOnly: false,
    navigateAuthenticatedTo: '/',
  },
});

const router = useRouter();
const { signIn, data } = useAuth();
const is_show_pass = ref<boolean>(false);
const is_signup_page = ref<boolean>(false);
const isValid = ref({ email: true, password: true });
const form = ref({ username: '', email: '', password: '' });

const handleLogin = async (even: Event) => {
  even.preventDefault();
  if (form.value.email === '' && form.value.password === '') {
    isValid.value.email = false;
    isValid.value.password = false;
  }
  if (!isValid.value.email || !isValid.value.password) return;

  await signIn('credentials', {
    email: form.value.email,
    password: form.value.password,
    redirect: false,
  });

  if (data.value?.user) {
    router.push({ path: '/' });
  } else {
    alert('Login is failure!');
  }
};

const handleSignUp = async (even: Event) => {
  even.preventDefault();
  if (form.value.email === '' && form.value.password === '') {
    isValid.value.email = false;
    isValid.value.password = false;
  }
  if (isValid.value.email || isValid.value.password) {
  }
};
</script>

<template>
  <div class="grid place-items-center w-full h-screen bg-chatroom_default">
    <div :class="`container ${is_signup_page ? 'right-panel-active' : ''}`" id="container">
      <div class="form-container sign-up-container">
        <form action="#">
          <h1>Create Account</h1>
          <div class="social-container">
            <div
              class="flexCenter w-[40px] h-[40px] rounded-full border-[1px] border-gray-200 cursor-pointer hover:text-white hover:bg-primary transition-all duration-200 ease-linear"
            >
              <Icon name="ion:social-facebook" size="20px" />
            </div>
            <div
              class="flexCenter w-[40px] h-[40px] rounded-full border-[1px] border-gray-200 cursor-pointer hover:text-white hover:bg-primary transition-all duration-200 ease-linear"
            >
              <Icon name="fe:google-plus" size="24px" />
            </div>
            <div
              class="flexCenter w-[40px] h-[40px] rounded-full border-[1px] border-gray-200 cursor-pointer hover:text-white hover:bg-primary transition-all duration-200 ease-linear"
            >
              <Icon name="basil:linkedin-solid" size="18px" />
            </div>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" class="outline-none" v-model="form.username" />
          <input
            type="email"
            placeholder="Email"
            class="outline-none"
            v-model="form.email"
            @keyup.enter="handleLogin"
            autocomplete="email"
            required
          />
          <div class="relative w-full h-fit">
            <input
              :type="`${is_show_pass ? 'text' : 'password'}`"
              placeholder="Password"
              class="outline-none"
              v-model="form.password"
              @keyup.enter="handleLogin"
              autocomplete="password"
              required
            />
            <div
              class="cursor-pointer absolute top-1/2 right-3 translate-y-[-50%] bg-transparent transition-all duration-200 ease-linear"
            >
              <Icon v-if="is_show_pass" name="fluent:eye-24-filled" @click="is_show_pass = false" />
              <Icon v-else name="fluent:eye-off-24-filled" @click="is_show_pass = true" />
            </div>
          </div>
          <button class="hover">Sign Up</button>
        </form>
      </div>
      <div class="form-container sign-in-container">
        <form action="#">
          <h1>Sign in</h1>
          <div class="social-container">
            <div
              class="flexCenter w-[40px] h-[40px] rounded-full border-[1px] border-gray-200 cursor-pointer hover:text-white hover:bg-primary transition-all duration-200 ease-linear"
            >
              <Icon name="ion:social-facebook" size="20px" />
            </div>
            <div
              class="flexCenter w-[40px] h-[40px] rounded-full border-[1px] border-gray-200 cursor-pointer hover:text-white hover:bg-primary transition-all duration-200 ease-linear"
            >
              <Icon name="fe:google-plus" size="24px" />
            </div>
            <div
              class="flexCenter w-[40px] h-[40px] rounded-full border-[1px] border-gray-200 cursor-pointer hover:text-white hover:bg-primary transition-all duration-200 ease-linear"
            >
              <Icon name="basil:linkedin-solid" size="18px" />
            </div>
          </div>
          <span>or use your account</span>
          <input
            type="email"
            placeholder="Email"
            class="outline-none"
            v-model="form.email"
            @keyup.enter="handleLogin"
            required
            autocomplete="email"
          />
          <div class="relative w-full h-fit">
            <input
              :type="`${is_show_pass ? 'text' : 'password'}`"
              placeholder="Password"
              class="outline-none"
              v-model="form.password"
              @keyup.enter="handleLogin"
              required
            />
            <div
              class="cursor-pointer absolute top-1/2 right-3 translate-y-[-50%] bg-transparent transition-all duration-200 ease-linear"
            >
              <Icon v-if="is_show_pass" name="fluent:eye-24-filled" @click="is_show_pass = false" />
              <Icon v-else name="fluent:eye-off-24-filled" @click="is_show_pass = true" />
            </div>
          </div>
          <a href="#">Forgot your password?</a>
          <button class="hover" @click="handleLogin">Log In</button>
        </form>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button class="ghost" id="signIn" @click="is_signup_page = false">Log In</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1 class="text-white">Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button class="ghost hover" id="signUp" @click="is_signup_page = true">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

* {
  box-sizing: border-box;
}

body {
  background: #f6f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  height: 100vh;
  margin: -20px 0 50px;
}

h1 {
  font-size: 34px;
  font-weight: bold;
  margin: 0;
}

h2 {
  text-align: center;
}

p {
  font-size: 15px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

button {
  border-radius: 20px;
  border: 1px solid var(--system_primary_color);
  background-color: var(--system_primary_color);
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: transparent;
  border-color: #ffffff;
}

form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

input {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

.hover:hover {
  color: var(--system_primary_color);
  background-color: white;
  transition: all 0.2s linear;
}

.container {
  display: grid;
  place-items: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: var(--system_primary_color);
  background: -webkit-linear-gradient(to right, #4283a8, var(--system_primary_color));
  background: linear-gradient(to right, #4283a8, var(--system_primary_color));
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  display: flex;
  gap: 14px;
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #dddddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

footer {
  background-color: #222;
  color: #fff;
  font-size: 14px;
  bottom: 0;
  position: fixed;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 999;
}

footer p {
  margin: 10px 0;
}

footer i {
  color: red;
}

footer a {
  color: #3c97bf;
  text-decoration: none;
}
</style>
