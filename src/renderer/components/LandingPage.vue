<template>
  <div id="wrapper">
    <div class="editor" contenteditable="true">
    </div>
  </div>
</template>

<script>
  import { setTimeout } from 'timers'

  export default {
    name: 'landing-page',
    mounted: () => {
      setTimeout(() => {
        this.focus_editor()
      }, 2000)
    },
    methods: {
      focus_editor () {
        console.log('focus dddd?')
        this.$refs.editor.select()
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  *:focus {
    outline: none;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    height: 100vh;
    padding: 10px;
    width: 100%;
    font-size: 18px;
  }
  .editor {
    width: 100%;
    height: 100%;
  }
</style>
