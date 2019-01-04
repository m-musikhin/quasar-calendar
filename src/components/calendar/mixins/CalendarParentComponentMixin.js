const { DateTime } = require('luxon')
export default {
  props: {
    value: {
      type: [Object, Date],
      default: new Date()
    },
    startDate: {
      type: [Object, Date],
      default: () => { return new Date() }
    },
    clickable: {
      type: Boolean,
      default: false
    },
    navDateFormat: {
      type: String,
      default: 'dd MMMM yyyy'
    },
    format24h: {
      type: Boolean,
      default: true
    },
    firstDayOfWeek: {
      type: Number,
      default: 1
    },
    eventArray: {
      type: Array,
      default: () => []
    },
    parsedEvents: {
      type: Object,
      default: () => {}
    },
    eventRef: {
      type: String,
      default: 'cal-' + Math.random().toString(36).substring(2, 15)
    },
    preventEventDetail: {
      type: Boolean,
      default: false
    },
    calendarLocale: {
      type: String,
      default: () => { return DateTime.local().locale }
    },
    calendarTimezone: {
      type: String,
      default: () => { return DateTime.local().zoneName }
    },
    sundayFirstDayOfWeek: {
      type: Boolean,
      default: false
    },
    allowEditing: {
      type: Boolean,
      default: false
    },
    dayDisplayStartHour: {
      type: Number,
      default: 7
    }
  },
  mounted () {}
}
