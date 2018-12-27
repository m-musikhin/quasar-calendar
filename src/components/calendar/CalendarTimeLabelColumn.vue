<template>
  <div class="calendar-day-column-label col-auto">
    <div
      class="calendar-day-time"
      v-for="thisHour in 24"
      :key="thisHour"
      :style="{ 'height': dayCellHeight, 'max-height': dayCellHeight }"
    >
      {{ formatTimeFromNumber(thisHour - 1) }}
    </div>
  </div>
</template>

<script>
  import QEventCalendarMixin from './mixins/CalendarMixin'
  const { DateTime } = require('luxon')
  export default {
    name: 'QEventCalendarTimeLabelColumn',
    props: {
      dayCellHeight: {
        type: String,
        default: '5rem'
      },
      calendarLocale: {
        type: String,
        default: () => { return DateTime.local().locale }
      }
    },
    components: {},
    mixins: [QEventCalendarMixin],
    data () {
      return {}
    },
    computed: {},
    methods: {},
    mounted () {}
  }
</script>

<style lang="stylus">
</style>
