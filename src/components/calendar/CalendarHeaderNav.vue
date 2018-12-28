<template>
  <div class="calendar-header col-auto row justify-between items-center">
    <div class="calendar-header-left col-auto">
      <q-btn
        @click="changePeriod(-1)"
        icon="chevron_left"
        color="primary"
        round
        flat
      />
    </div>
    <div class="calendar-header-label">
      <slot/>
    </div>
    <div class="calendar-header-right col-auto">
      <q-btn
        @click="changePeriod(+1)"
        icon="chevron_right"
        color="primary"
        round
        flat
      />
    </div>
  </div>
</template>

<script>
  const { DateTime } = require('luxon')

  import {
    QBtn
  } from 'quasar'
  export default {
    name: 'QEventCalendarHeaderNav',
    props: {
      value: {
        type: [Object, Date],
        required: true
      },
      periodUnit: {
        type: String,
        default: 'days'
      },
      periodAmount: {
        type: Number,
        default: 1
      }
    },
    components: {
      QBtn
    },
    data () {
      return {
        workingDate: this.value
      }
    },
    computed: {},
    methods: {
      changePeriod: function (param) {
        let paramObj = {}
        paramObj[this.periodUnit] = this.periodAmount * param
        // console.log('AAA: ' + this.value + ' ===' + JSON.stringify((paramObj)))
        this.$emit('input', DateTime.fromJSDate(this.value).plus(paramObj).toJSDate())
      }
    }
  }
</script>

<style lang="stylus">
  .calendar-header
    .calendar-month-year
      font-size 1.25em
      font-weight bold
</style>
