<script lang="ts" setup>
const router = useRouter();
const room_id = ref<string>('');

const handleJoinRoom = () => {
  if (!room_id.value) return;
  router.push('/call/room/' + room_id.value);
};
</script>

<template>
  <section class="flexCenter w-full h-screen">
    <form class="form border-[1px] border-solid border-gray-200 shadow-xl">
      <div class="flex-column">
        <label>Chatroom Id </label>
      </div>
      <div class="inputForm">
        <Icon name="mdi:rename-outline" class="text-xl" />
        <input
          type="text"
          class="input"
          placeholder="Enter chatroom id"
          v-model="room_id"
          @keyup.enter="handleJoinRoom"
        />
      </div>

      <div class="flexCenter">
        <button class="button-submit transition-all duration-200 ease-linear hover:opacity-75" @click="handleJoinRoom">
          John chatroom
        </button>
      </div>
    </form>
  </section>
</template>

<style>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 30px;
  width: 450px;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

.form button {
  align-self: flex-end;
}

.flex-column > label {
  color: #151717;
  font-weight: 600;
}

.inputForm {
  border: 1.5px solid #ecedec;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  transition: 0.2s ease-in-out;
}

.input {
  margin-left: 10px;
  border-radius: 10px;
  border: none;
  width: 85%;
  height: 100%;
}

.input:focus {
  outline: none;
}

.inputForm:focus-within {
  border: 1.5px solid #2d79f3;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.flex-row > div > label {
  font-size: 14px;
  color: black;
  font-weight: 400;
}

.button-submit {
  margin: 20px 0 10px 0;
  background-color: var(--system_primary_color);
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 40px;
  height: 40px;
  width: 50%;
  cursor: pointer;
  font-family: 'roboto';
}

.p {
  text-align: center;
  color: black;
  font-size: 14px;
  margin: 5px 0;
}

.btn {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  gap: 10px;
  border: 1px solid #ededef;
  background-color: white;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.btn:hover {
  border: 1px solid #2d79f3;
}
</style>
