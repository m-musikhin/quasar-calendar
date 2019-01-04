<template>
  <div class="calendar-month">

    <!-- calendar header -->
    <q-event-calendar-header-nav
      period-unit="month"
      :calendar-locale="calendarLocale"
      v-model="workingDate"
    >
      {{ formatDate(workingDate, navDateFormat) }}
    </q-event-calendar-header-nav>

    <div class="calendar-content">
      <div class="calendar-day-labels row no-wrap justify-end">
        <div
          v-for="dayName in headerDayNames"
          :key="dayName"
          class="calendar-day-label"
       >
          {{dayName}}
        </div>
      </div>
      <div
        v-for="(thisWeek, index) in weekArray"
        :key="index"
        :class="{
          'calendar-multi-day': true,
          'row': true,
          'no-wrap': true,
          'items-start': true,
          'justify-end': index < (weekArray.length - 1),
          'justify-start': index === (weekArray.length - 1)
        }"
      >
        <div
          :class="{
            'calendar-day': true,
            'calendar-cell': true,
            'calendar-day-weekend': isWeekendDay(thisDay.dateObject),
            'calendar-day-current': isCurrentDate(thisDay.dateObject),
            'cursor-pointer': calendarDaysAreClickable
          }"
          v-for="(thisDay, weekDayIndex) in thisWeek"
          :key="makeDT(thisDay.dateObject).toISODate()"
          @click="handleDayClick(thisDay.dateObject)"
        >
          <div
            :class="{
              'calendar-day-number': true,
              'cursor-pointer': calendarDaysAreClickable
            }"
          >
            <quantity-bubble
              v-if="isCurrentDate(thisDay.dateObject)"
              :quantity="thisDay.dateObject.day"
              :offset="false"
            />
            <template v-else>{{ thisDay.dateObject.day }}</template>
          </div>
          <div class="calendar-day-content">
            <template v-if="hasAnyEvents(thisDay.dateObject)">
              <div
                v-for="thisEvent in monthGetDateEvents(thisDay.dateObject)"
                :key="thisEvent.id"
                @click.stop="$emit('click-event', thisEvent)"
              >
                <q-event-calendar-event
                  :event-object="thisEvent"
                  :month-style="true"
                  :event-ref="eventRef"
                  :prevent-event-detail="preventEventDetail"
                  :current-calendar-day="thisDay.dateObject"
                  :has-previous-day="thisEvent.hasPrev"
                  :has-next-day="thisEvent.hasNext"
                  :first-day-of-week="(weekDayIndex === 0)"
                  :last-day-of-week="(weekDayIndex === (thisWeek.length -1))"
                  :allow-editing="allowEditing"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import QEventCalendarMixin from './mixins/CalendarMixin'
  import QEventCalendarEventMixin from './mixins/CalendarEventMixin'
  import QEventCalendarParentComponentMixin from './mixins/CalendarParentComponentMixin'
  import {
    QBtn,
    QTooltip,
    QTabs,
    QTab,
    QTabPane,
    QScrollArea
  } from 'quasar'
  import QuantityBubble from './QuantityBubble'
  import QEventCalendarEvent from './CalendarEvent'
  import QEventCalendarHeaderNav from './CalendarHeaderNav'
  import QEventCalendarModalDetail from './CalendarModalDetail'
  const { DateTime } = require('luxon')
  export default {
    name: 'QEventCalendarMonth',
    components: {
      QuantityBubble,
      QEventCalendarEvent,
      QEventCalendarHeaderNav,
      QEventCalendarModalDetail,
      QBtn,
      QTooltip,
      QTabs,
      QTab,
      QTabPane,
      QScrollArea
    },
    mixins: [QEventCalendarParentComponentMixin, QEventCalendarMixin, QEventCalendarEventMixin],
    props: {
      fullComponentRef: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        workingDate: this.value,
        // weekArray: [],
        parsed: this.getDefaultParsed(),
        eventDetailEventObject: {}
      }
    },
    computed: {
      weekArray () {
        return this.getCalendarCellArray(
          this.makeDT(this.workingDate).month,
          this.makeDT(this.workingDate).year
        )
      },
      calendarDaysAreClickable () {
        return this.clickable
      }
    },
    methods: {
      monthGetDateEvents (dateObject) {
        return this.dateGetEvents(dateObject)
      },
      getCalendarCellArray (monthNumber, yearNumber) {
        let currentDay = this.makeDT(
          DateTime.fromObject({
            year: yearNumber,
            month: monthNumber,
            day: 1
          })
        )
        let currentWeekOfYear = this.getWeekNumber(currentDay, this.sundayFirstDayOfWeek)
        let weekArray = []
        let currentWeekArray = []
        let thisDayObject = {}
        for (let thisDateOfMonth = 1; thisDateOfMonth <= 31; thisDateOfMonth++) {
          currentDay = this.makeDT(
            DateTime.fromObject({
              year: yearNumber,
              month: monthNumber,
              day: thisDateOfMonth
            })
          )
          if (
            currentDay.year === yearNumber &&
            currentDay.month === monthNumber
          ) {
            if (
              this.getWeekNumber(currentDay, this.sundayFirstDayOfWeek) !== currentWeekOfYear
            ) {
              weekArray.push(currentWeekArray)
              currentWeekOfYear = this.getWeekNumber(currentDay, this.sundayFirstDayOfWeek)
              currentWeekArray = []
            }
            thisDayObject = {
              dateObject: currentDay,
              year: currentDay.year,
              month: currentDay.month,
              date: currentDay.day,
              dayName: currentDay.toFormat('EEEE'),
              dayNumber: currentDay.weekday
            }
            currentWeekArray.push(thisDayObject)
          }
        }
        if (weekArray.length > 0) {
          weekArray.push(currentWeekArray)
        }
        return weekArray
      },
      handleDayClick (dateObject) {
        if (this.clickable) {
          this.$emit('input', dateObject)
        }
      }
    },
    mounted () {
      this.handlePassedInEvents()
      this.$root.$on(
        'update-event-' + this.eventRef,
        this.handleEventUpdate
      )
    },
    watch: {
      startDate: 'handleStartChange',
      eventArray: function () {
        this.getPassedInEventArray()
      },
      parsedEvents: function () {
        this.getPassedInParsedEvents()
      }
    }
  }
</script>

<style lang="stylus">
  @import 'calendar.vars.styl'

  .calendar-month

    .calendar-time-width
      width $dayTimeLabelWidth
    .calendar-time-margin
      margin-left $dayTimeLabelWidth

    .calendar-header
      .calendar-header-label
        font-size 1.25em
        font-weight bold
    .calendar-content
      padding 4px 12px
      .calendar-cell
        width $cellWidth
        max-width $cellWidth
        padding 0
      .calendar-day-labels
        padding 0
        .calendar-day-label
          width $sevenCellWidth
          text-align right
          font-size 1.1em
        .calendar-day-label-current
          font-weight bold
      .calendar-multi-day
        border-bottom 1px solid $borderColor
        :last-child
          border-bottom none
      .calendar-day
        background-color none
        height $cellHeight
        max-height $cellHeight
        overflow hidden
        width $sevenCellWidth
        .calendar-day-number
          font-size 0.9em
          height 2em
          width 100%
          text-align right
          vertical-align middle
          padding-top .25em
          padding-left .25em
      .calendar-day-current
        background-color $currentDayBackgroundColor
      .calendar-day-weekend
        background-color $weekendDayBackgroundColor

</style>
