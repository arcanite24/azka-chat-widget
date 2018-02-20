<template>
  <chat-window></chat-window>
  <!--
  <div class="demo-c max-dim">

    <div class="page-c max-dim">
      <iframe src="http://127.0.0.1:8080/" frameborder="0"></iframe>
    </div>

    <chat-window></chat-window>

    <div class="chat-global-c max-dim">
      
    </div>

  </div>
  -->
</template>

<script>

</script>

<style lang="scss" scoped>

  * {
    box-sizing: border-box !important;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .max-dim {
    width: 100%;
    height: 100vh;
  }

  .demo-c {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .page-c {

    iframe {
      width: 100%;
      height: 100%;
    }

  }

  .chat-c {
    width: 100%;
    height: 100vh;
  }

  .chat-global-c {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding: 1rem;

  }
  
</style>
