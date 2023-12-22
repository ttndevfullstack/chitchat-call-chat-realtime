import mitt from 'mitt';

export default defineNuxtPlugin(() => {
  const emitter = mitt();

  return {
    provide: {
      createNewDirect: {
        $on: emitter.on,
        $emit: emitter.emit,
      },
      createNewGroup: {
        $on: emitter.on,
        $emit: emitter.emit,
      },
      deleteChatroom: {
        $on: emitter.on,
        $emit: emitter.emit,
      },
    },
  };
});
