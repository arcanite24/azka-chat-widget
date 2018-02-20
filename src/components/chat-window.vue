<template>
  <div class="chat-c">
    <div class="messages-c flex flex-col">
      <div class="message animated fadeIn" v-for="(m, i) in messages" :class="{'self': m.self, 'out': '!m.self'}" :key="i">
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
      <div class="message out loader-c" v-if="loader" id="loader-msg">
        <img src="/static/loader.gif" alt="Cargando..." class="loader">
      </div>
    </div>
    <div class="controls-c">
      <form v-on:submit.prevent="sendMessage(text)" class="flex flex-row flex-center">
        <input type="text" class="main-input" v-model="text">
        <button class="send-btn" type="submit">Enviar</button>
      </form>
    </div>
  </div>
</template>

<script>
import { API, API_KEY, guid } from './tools'
import moment from 'moment'
import axios from 'axios'

moment.locale('es')

export default {
  data () {
    return {
      bot: '89397',
      guid: '',
      text: '',
      messages: [],
      loader: false,
    }
  },
  created() {
    this.guid = guid()
    console.log(this.guid)
  },
  mounted() {
    let _this = this
    this.$nextTick(function() {
      window.addEventListener('message', function(e) {

        if (typeof e.data != 'string') return
        const payload = JSON.parse(e.data)

        switch (payload.event) {
          case 'NEW_MESSAGE':
            _this.handleMessage(payload.message)
            break;
        
          default:
            alert('Accion no definida')
            break;
        }

      }, false)
    })
  },
  methods: {
    format(date) {
      return moment(date).calendar()
    },
    handleButton(type, target) {
      switch (type) {
        case 'module':
          this.sendMessage(target)
          break;
      }
    },
    handleMessage(e) {
      this.sendMessage(e)
    },
    async sendMessage(text) {
      // validations
      if (!this.guid) return alert('Session not initialized')
      if (!text) return
      if (text.length <= 0) return

      this.loader = true

      // push self message to conversation array
      this.messages.push({text, self: true, date: Date.now(), id: guid()})
      this.text = ''
      setTimeout(() => this.$scrollTo('#loader-msg', 500, {container: '.messages-c', easing: 'ease-in-out'}), 100)

      // make request to Motion.ai
      try {
        const res = await axios.get(`${API}/messageBot?bot=${this.bot}&msg=${text}&session=${this.guid}&key=${API_KEY}`)
        // extract video and img tags
        const vList = res.data.botResponse ? res.data.botResponse.match(/\[video\](.*?)\[\/video\]/g) : []
        const videos = vList ? vList.map(v => v.replace('[video]', '').replace('[/video]')) : []

        // split responsec
        const temp = res.data.botResponse ? res.data.botResponse.replace(/\r?\n|\r/g, '') : res.data.err
        const nextRegex = /::next(?:-\d*)?::/g
        const msgArr = temp.split(nextRegex)
        var delays = temp.match(nextRegex)

        msgArr.forEach((m, i) => {
          const msg = {text: m.replace(/\[video\](.*?)\[\/video\]/g, ''), id: guid(), date: Date.now(), quick: res.data.quickReplies, cards: res.data.cards, videos}
          if (delays && delays.length > 0 && i > 0) {
            if (!delays[i - 1]) {
              this.messages.push(msg)
            } else if (delays[i - 1] == '::next::') {
              this.messages.push(msg)
            } else {
              const delay = parseInt(delays[i - 1].replace(/::/g, '').replace('next-', ''))
              setTimeout(() => this.messages.push(msg), delay)
            }
          } else {
            this.messages.push(msg)
          }
        })


        // scrollTo new message
        this.$scrollTo('#loader-msg', 1000, {container: '.messages-c', easing: 'ease-in-out'})
        this.loader = false
      } catch (e) {
        this.loader = false
        console.log(e)
        alert('Error with motion')
      }

    }
  }
}
</script>

<style lang="scss" scoped>

  @mixin aspect-ratio($width, $height) {
    position: relative;
    &:before {
      display: block;
      content: "";
      width: 100%;
      padding-top: ($height / $width) * 100%;
    }
    > .content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    }

  // layout
  .chat-c {
  }

  .messages-c {
    overflow-y: scroll;
    height: calc(100% - 48px);
    padding-top: 1rem;
    background:
      linear-gradient(135deg, #eee 25%, transparent 25%) -50px 0,
      linear-gradient(225deg, #eee 25%, transparent 25%) -50px 0,
      linear-gradient(315deg, #eee 25%, transparent 25%),
      linear-gradient(45deg, #eee 25%, transparent 25%);
    background-size: 2em 2em;
    background-color: #e0e0e0;
  }

  .controls-c {
    height: 48px;
    form { height: 100%; }
  }

  // messages
  .message {
    padding: 1rem;
    background-color: #30a7cc;
    color: white;
    border-radius: 10px;
    margin: 0 1rem 1rem;
    overflow-y: visible;
    font-size: 1rem;
    .time {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.8)
    }
    .triangle-out {
      position: absolute;
      margin-left: -1.5rem;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-right:10px solid #30a7cc;
    }
  }
  .self {
    background-color: #b6b6b6;
    margin-left: auto;
  }
  .out {
    align-self: flex-start;
  }

  // controls
  .main-input {
    width: 90%;
    height: 100%;
    padding: 0.5rem;
  }

  .send-btn {
    width: 10%;
    height: 100%;
    color: white;
    background-color: #30a7cc;
    border: none;
    text-transform: uppercase;
    font-size: 0.65rem;
  }

  // loader
  .loader-c {
    width: 20%;
    padding: 0;
  }
  .loader {
    width: 50%;
  }

  // quick replies
  .quick-btn {
    padding: 0.5rem;
    border: none;
    margin: 0.5rem 1rem 0 0.5rem;
    color: white;
    border: 2px solid white;
    background: none;
    border-radius: 10px;
    transition: all 0.1s ease-out;
    &:active {
      color: #fa731d;
      border: 2px solid #fa731d;
      transition: all 0.1s ease-in;
    }
  }

  // cards
  .card {
    background-color: #8cc6d7;
    border: 1px solid #65bed7;
    margin: 0.5rem;
    border-radius: 5px;
    width: 250px;
    padding: 0.5rem;

    h1 {
      color: white;
      font-size: 1.25rem;
    }

    .img-c {
      @include aspect-ratio(1.91, 1);
      margin-bottom: 0.5rem;
    }

    button {
      margin-top: 0.5rem;
      border: none;
      font-size: 1rem;
      border-radius: 5px;
      padding: 0.5rem;
      color: white;
      background-color: rgb(29, 87, 175);

      &:hover {
        background-color: rgb(42, 104, 198);
        cursor: pointer;
      }

    }

  }
</style>
