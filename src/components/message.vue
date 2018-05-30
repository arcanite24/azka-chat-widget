<template>  
  <div class="message animated fadeIn" :class="{'self': m.self, 'out': '!m.self'}">
    <p class="text" v-html="m.text"></p>
    <span class="time">{{format(m.date)}}</span>
    <div class="quick-c" v-if="m.quick">
      <button class="quick-btn" v-for="(q, i) in m.quick" :key="i" @click="sendMessage(q.title)">{{q.title}}</button>
    </div>
    <div class="cards-c flex flex-row" v-if="m.cards">
      <div class="card flex flex-col" v-for="(card, i) in m.cards" :key="i">
        <div class="img-c" v-if="card.cardImage" :style="'background: url('+card.cardImage+');background-size: 100%;'">
        </div>
        <h1>{{card.cardTitle}}</h1>
        <button v-for="(b, i) in card.buttons" v-if="card.buttons" @click="handleButton(b.buttonType, b.target)" :key="i">{{b.buttonText}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['m']
}
</script>

<style>

</style>
