<template>
  <div class="calendar-test">
    <q-tabs v-model="selectedTab" class="calendar-tabs" ref="fullCalendarTabs" inverted>
      <q-tab
        name="tab-month"
        icon="view_module"
        :label="tabLabels.month"
        default
        slot="title"
      />
      <q-tab
        name="tab-week-component"
        icon="view_week"
        :label="tabLabels.week"
        slot="title"
      />
      <q-tab
        name="tab-days-component"
        icon="view_column"
        :label="tabLabels.threeDay"
        slot="title"
      />
      <q-tab
        name="tab-single-day-component"
        icon="view_day"
        :label="tabLabels.day"
        slot="title"
      />
      <q-tab
        name="tab-agenda"
        icon="view_agenda"
        :label="tabLabels.agenda"
        slot="title"
      />

      <q-tab-pane name="tab-month" class="calendar-tab-pane-month">
        <q-event-calendar-month
          :ref="'month-' + thisRefName"
          :start-date="workingDate"
          :parsed-events="parsed"
          :event-ref="eventRef"
          :full-component-ref="true"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          :clickable="clickable"
          :value="workingDate"
          @input="clickMonthDay"
          @click-event="clickCalendarEvent"
        />
      </q-tab-pane>
      <q-tab-pane name="tab-week-component" class="calendar-tab-pane-week">
        <q-event-calendar-multi-day
          :ref="'week-' + thisRefName"
          :start-date="workingDate"
          :parsed-events="parsed"
          :num-days="7"
          :nav-days="7"
          :force-start-of-week="true"
          :event-ref="eventRef"
          :full-component-ref="true"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          :day-display-start-hour="dayDisplayStartHour"
          :value="workingDate"
        />
      </q-tab-pane>
      <q-tab-pane name="tab-days-component" class="calendar-tab-pane-week">
        <q-event-calendar-multi-day
          :ref="'days-' + thisRefName"
          :start-date="workingDate"
          :parsed-events="parsed"
          :num-days="3"
          :nav-days="1"
          :force-start-of-week="false"
          :event-ref="eventRef"
          :full-component-ref="true"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          :day-display-start-hour="dayDisplayStartHour"
          :value="workingDate"
        />
      </q-tab-pane>
      <q-tab-pane name="tab-single-day-component" class="calendar-tab-pane-week">
        <q-event-calendar-multi-day
          :ref="'day-' + thisRefName"
          :start-date="workingDate"
          :parsed-events="parsed"
          :num-days="1"
          :nav-days="1"
          :force-start-of-week="false"
          :event-ref="eventRef"
          :full-component-ref="true"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          :day-display-start-hour="dayDisplayStartHour"
          :value="workingDate"
        />
      </q-tab-pane>
      <q-tab-pane name="tab-agenda" class="calendar-tab-pane-agenda">
        <q-event-calendar-agenda
          :ref="'agenda-' + thisRefName"
          :start-date="workingDate"
          :parsed-events="parsed"
          :num-days="28"
          :event-ref="eventRef"
          scroll-height="300px"
          :full-component-ref="true"
          :sunday-first-day-of-week="sundayFirstDayOfWeek"
          :calendar-locale="calendarLocale"
          :calendar-timezone="calendarTimezone"
          :prevent-event-detail="preventEventDetail"
          :allow-editing="allowEditing"
          :value="workingDate"
          @click-event="clickCalendarEvent"
        />
      </q-tab-pane>
    </q-tabs>

    <q-event-calendar-modal-detail
      :allow-editing="allowEditing"
      v-model="detailEventObject"
    />

  </div>
</template>

<script>
  import QEventCalendarMixin from './mixins/CalendarMixin'
  import QEventCalendarEventMixin from './mixins/CalendarEventMixin'
  import QEventCalendarParentComponentMixin from './mixins/CalendarParentComponentMixin'
  import QEventCalendarEvent from './CalendarEvent'
  import QEventCalendarMonth from './CalendarMonth'
  import QEventCalendarMultiDay from './CalendarMultiDay'
  import QEventCalendarAgenda from './CalendarAgenda'
  import QEventCalendarDayColumn from './CalendarDayColumn'
  import QEventCalendarTimeLabelColumn from './CalendarTimeLabelColumn'
  import QEventCalendarDayLabels from './CalendarDayLabels'
  import QEventCalendarHeaderNav from './CalendarHeaderNav'
  import QEventCalendarModalDetail from './CalendarModalDetail'
import {
    QBtn,
    QTooltip,
    QTabs,
    QTab,
    QTabPane,
    QScrollArea
  } from 'quasar'
  export default {
    name: 'QEventCalendar',
    mixins: [QEventCalendarParentComponentMixin, QEventCalendarMixin, QEventCalendarEventMixin],
    props: {
      tabLabels: {
        type: Object,
        default: () => {
          return {
            month: 'Month',
            week: 'Week',
            threeDay: '3 Day',
            day: 'Day',
            agenda: 'Agenda'
          }
        }
      }
    },
    components: {
      QEventCalendarModalDetail,
      QEventCalendarEvent,
      QEventCalendarMonth,
      QEventCalendarMultiDay,
      QEventCalendarAgenda,
      QEventCalendarDayColumn,
      QEventCalendarTimeLabelColumn,
      QEventCalendarDayLabels,
      QEventCalendarHeaderNav,
      QBtn,
      QTooltip,
      QTabs,
      QTab,
      QTabPane,
      QScrollArea
    },
    data () {
      return {
        selectedTab: 'tab-month',
        detailEventObject: null,
        dayCellHeight: 5,
        dayCellHeightUnit: 'rem',
        workingDate: this.value,
        parsed: {
          byAllDayStartDate: {},
          byStartDate: {},
          byId: {}
        },
        dayRowArray: [],
        thisRefName: this.createRandomString()
      }
    },
    computed: {},
    methods: {
      clickMonthDay (dateObject) {
        this.workingDate = dateObject
        this.selectedTab = 'tab-single-day-component'
      },
      clickCalendarEvent (event) {
        // console.log('clickCalendarEvent: ' + JSON.stringify(event))
        this.detailEventObject = event
      },
      setupEventsHandling: function () {
        this.$root.$on(
          'update-event-' + this.eventRef,
          this.handleEventUpdate
        )
      }
    },
    mounted () {
      this.parseEventList()
      this.setupEventsHandling()
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

  .calendar-tabs
    .calendar-tab-pane-day,
    .calendar-tab-pane-week
      height 60vh
      max-height 60vh
      overflow hidden
    .q-tab-pane
      border none

</style>
