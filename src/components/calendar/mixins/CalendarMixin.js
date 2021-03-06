import dashHas from 'lodash.has'
const { DateTime } = require('luxon')
export default {
  computed: {
    computedFormat24h () {
      return this.format24h !== 0
        ? this.format24h
        : this.$q.i18n.date.format24h
    },
    computedFirstDayOfWeek () {
      return this.firstDayOfWeek !== void 0
        ? this.firstDayOfWeek
        : this.$q.i18n.date.firstDayOfWeek
    },
    headerDayNames () {
      const
        days = this.$q.i18n.date.daysShort,
        first = this.computedFirstDayOfWeek

      return first > 0
        ? days.slice(first, 7).concat(days.slice(0, first))
        : days
    }
  },
  methods: {
    handleStartChange: function (val, oldVal) {
      this.doUpdate()
    },
    makeDT: function (dateObject, adjustTimezone) {
      if (typeof dateObject === 'undefined') {
        return null
      }
      if (dateObject instanceof Date) {
        dateObject = DateTime.fromJSDate(dateObject)
      }
      if (
        this.calendarLocale &&
        (!dashHas(dateObject, 'locale') || this.calendarLocale !== dateObject.locale)
      ) {
        dateObject = dateObject.setLocale(this.calendarLocale)
      }
      if (adjustTimezone && adjustTimezone !== dateObject.zoneName) {
        dateObject = dateObject.setZone(this.calendarTimezone)
      }
      return dateObject
    },
    triggerEventClick: function (eventObject, eventRef) {
      this.$root.$emit(
        'click-event-' + eventRef,
        eventObject
      )
    },
    fullMoveToDay: function (dateObject) {
      if (this.fullComponentRef) {
        this.$root.$emit(
          // TODO need replace
          // this.fullComponentRef + ':moveToSingleDay', {
          //  dateObject: dateObject
          // }
        )
      }
    },
    getEventColor: function (eventObject, colorName) {
      if (dashHas(eventObject, colorName)) {
        return eventObject[colorName]
      }
      else if (dashHas(this, colorName)) {
        return this[colorName]
      }
      else if (colorName === 'textColor') {
        return 'white'
      }
      else {
        return 'primary'
      }
    },
    addCssColorClasses: function (cssObject, eventObject) {
      cssObject['bg-' + this.getEventColor(eventObject, 'color')] = true
      cssObject['text-' + this.getEventColor(eventObject, 'textColor')] = true
      return cssObject
    },
    formatDate: function (dateObject, formatString, usePredefined) {
      if (usePredefined) {
        return this.makeDT(dateObject).toLocaleString(DateTime[formatString])
      }
      else {
        return this.makeDT(dateObject).toFormat(formatString)
      }
    },
    dateAdjustWeekday (thisDateObject, weekdayNum) {
      thisDateObject = this.makeDT(thisDateObject)
      let checkDate = DateTime.local()
      let adjustForward = true
      if (weekdayNum < 1) {
        adjustForward = false
        weekdayNum = Math.abs(weekdayNum)
        if (weekdayNum === 0) {
          weekdayNum = 7
        }
      }
      for (let counter = 1; counter <= 7; counter++) {
        if (adjustForward) {
          checkDate = thisDateObject.plus({ days: counter })
        }
        else {
          checkDate = thisDateObject.minus({ days: counter })
        }
        if (checkDate.weekday === weekdayNum) {
          return checkDate
        }
      }
    },
    buildWeekDateArray: function (workingDate, numberOfDays, sundayFirstDayOfWeek) {
      // TODO forceStartOfWeek
      if (this.forceStartOfWeek) {
        return this.getForcedWeekDateArray(workingDate, numberOfDays, sundayFirstDayOfWeek)
      }
      else {
        return this.getWeekDateArray(workingDate, numberOfDays)
      }
    },
    getForcedWeekBookendDates: function (workingDate, numberOfDays, sundayFirstDayOfWeek) {
      if (numberOfDays === undefined) {
        numberOfDays = 7
      }
      if (sundayFirstDayOfWeek) {
        return {
          first: this.dateAdjustWeekday(workingDate, -1).minus({days: 1}),
          last: this.dateAdjustWeekday(workingDate, numberOfDays).minus({days: 1})
        }
      }
      else {
        return {
          first: this.dateAdjustWeekday(workingDate, -1),
          last: this.dateAdjustWeekday(workingDate, numberOfDays)
        }
      }
    },
    getForcedWeekDateArray: function (workingDate, numberOfDays, sundayFirstDayOfWeek) {
      let bookendDates = this.getForcedWeekBookendDates(workingDate, numberOfDays, sundayFirstDayOfWeek)
      let returnArray = []
      for (let counter = 0; counter <= numberOfDays - 1; counter++) {
        returnArray.push(
          this.makeDT(bookendDates.first).plus({days: counter})
        )
      }
      return returnArray
    },
    getWeekDateArray: function (workingDate, numberOfDays) {
      let returnArray = []
      for (let counter = 0; counter <= numberOfDays - 1; counter++) {
        returnArray.push(
          this.makeDT(workingDate).plus({ days: counter })
        )
      }
      return returnArray
    },
    formatTimeFromNumber: function (hourNumber) {
      // TODO: this should be able to handle 24 hour and alternate time formats
      let tempDate = this.makeDT(DateTime.fromObject({ hour: hourNumber }))
      let localeFormattedHour = tempDate.toLocaleString(DateTime.TIME_SIMPLE)
      return localeFormattedHour
        .replace(/:[0-9][0-9]/, '')
        .replace(' ', '')
        .toLowerCase()
    },
    simplifyTimeFormat: function (timeString, removeMeridiem) {
      if (removeMeridiem) {
        timeString = timeString.replace(/[AP]M/i, '')
      }
      return timeString
        .replace(':00', '')
        .replace(' ', '')
        .toLowerCase()
    },
    moveTimePeriod: function (params) {
      let paramObj = {}
      paramObj[params.unitType] = params.amount
      this.workingDate = this.workingDate.plus(paramObj)
    },
    getDayOfWeek: function () {
      return this.createThisDate(this.dayNumber).format('dddd')
    },
    createThisDate: function (dateNum) {
      return this.parseDateParams(dateNum)
    },
    isCurrentDate: function (thisDateObject) {
      return DateTime.local().hasSame(
        this.makeDT(thisDateObject),
        'day'
      )
    },
    isWeekendDay: function (thisDateObject) {
      const dayNumber = this.makeDT(thisDateObject).weekday
      return (dayNumber === 6 || dayNumber === 7)
    },
    getWeekNumber (thisDateObject, useSundayStart) {
      if (useSundayStart) {
        return this.makeDT(thisDateObject).plus({days: 1}).weekNumber
      }
      else {
        return this.makeDT(thisDateObject).weekNumber
      }
    },
    mountSetDate: function () {
      // TODO remove function after refactoring
      // this.workingDate = this.makeDT(this.value)
    },
    decimalAdjust: function (type, value, exp) {
      // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
      // If the exp is undefined or zero...
      if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value)
      }
      value = +value
      exp = +exp
      // If the value is not a number or the exp is not an integer...
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN
      }
      // Shift
      value = value.toString().split('e')
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)))
      // Shift back
      value = value.toString().split('e')
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp))
    },
    calculateDayCellWidth: function (numberOfDays) {
      return this.decimalAdjust(
        'floor',
        100 / numberOfDays,
        -3
      ) + '%'
    },
    createRandomString: function () {
      return Math.random().toString(36).substring(2, 15)
    },
    getEventIdString: function (eventObj) {
      if (dashHas(eventObj, 'id')) {
        if (typeof eventObj.id === 'number') {
          return eventObj.id.toString()
        }
        else if (typeof eventObj.id === 'string') {
          return eventObj.id
        }
        else {
          return '' + eventObj.id
        }
      }
      else {
        return 'NOID' + this.createRandomString()
      }
    },
    getDayHourId: function (eventRef, workingDate, thisHour) {
      return eventRef +
        '-' +
        this.makeDT(workingDate).toISODate() +
        '-hour-' +
        thisHour
    }
  },
  mounted () {}
}
