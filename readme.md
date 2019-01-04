# Quasar Event Calendar
!!!QEventCalendar work ONLY in [Quasar framework](https://quasar-framework.org/) eviroment!!!
(based on project [Quasar Calendar by Stormseed aka Chris Benjamin](https://github.com/stormseed/quasar-calendar))
This project rewrite Quasar Calendar without Global bus events with using only local events and v-model for current day (start-day)

An event display calendar for the [Quasar framework](https://quasar-framework.org/). This is still a work in progress project but we're putting in functionality and squashing bugs on a consistent basis.

![screenshot](https://stormseed.github.io/quasar-calendar-demo/statics/quasar_calendar_snap.png)

## Demo

Sorry now no demo. You can see a demo of the Quasar calendar components with event data at:

[Quasar calendar demo](https://stormseed.github.io/quasar-calendar-demo)

## Setup

```shell
npm install quasar-event-calendar (not yet)
```

Sorry now only from git
```shell
npm install git+https://github.com/m-musikhin/quasar-event-calendar.git
```


Add Calendar to you .vue page similar to a a Quasar component

```js
import { QEventCalendar } from 'quasar-event-calendar'
```

or import individual components

```js
import {
  QEventCalendarMonth,
  QEventCalendarAgenda,
  QEventCalendarMultiDay
} from 'quasar-event-calendar'
```

In your template, you can just put in a calendar viewer using the current date as the start date

```html
<q-event-calendar />
```

Or you can pass in parameters to customize

```html
<q-event-calendar-month
  v-model="currentDay"
  :event-array="someEventObject"
  :sunday-first-day-of-week="true"
  calendar-locale="en"
  calendar-timezone="Europe/Paris"
/>
```
or

```html
<q-event-calendar-month
  :value="Date('2019-01-01')"
  :event-array="someEventObject"
  :sunday-first-day-of-week="true"
  calendar-locale="en"
  calendar-timezone="Europe/Paris"
/>
```


## Event data format

The event data format is meant to be a subset of the [Google Calendar v3 API](https://developers.google.com/google-apps/calendar/v3/reference/events) (*this is still a work in progress*). Events should be passed in as an array of objects. Each object can have elements like in this example:

```js
[
  {
    id: 1,
    summary: 'Test event',
    description: 'Some extra info goes here',
    location: 'Office of the Divine Randomness, 1232 Main St., Denver, CO',
    start: {
      dateTime: '2018-02-16T14:00:00', // ISO 8601 formatted
      timeZone: 'America/New_York' // Timezone listed as a separate IANA code
    },
    end: {
      dateTime: '2018-02-16T16:30:00',
      timeZone: 'American/New_York'
    },
    color: 'positive',
    attendees: [
      {
        id: 5,
        email: 'somebody@somewhere.com',
        displayName: 'John Q. Public',
        organizer: false,
        self: false,
        resource: false
      }
    ]
  },
  {
    id: 2,
    summary: 'Test all-day event',
    description: 'Some extra info goes here',
    start: {
      date: '2018-02-16' // A date variable indicates an all-day event
    },
    end: {
      date: '2018-02-19'
    }
  },
    {
      id: 3,
      summary: 'Some other test event',
      description: 'Some extra info goes here',
      start: {
        dateTime: '2018-02-17T10:00:00+0500', // timezone embedded in dateTime
      },
      end: {
        dateTime: '2018-02-17T12:30:00+0500',
      },
    },
]
```

Each object needs to have a unique ID. The date time should be in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. A value in the optional `timeZone` field will override the timezone.

## Common QEventCalendar components

### Properties

The usable components of `QEventCalendar`, `QEventCalendarMonth`, `QEventCalendarMultiDay` and `QEventCalendarAgenda` share the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `v-model` | DateTime | A JavaScript variable with Date or Luxon DateTime object that passes in a starting display date for the calendar to display. |
| `clickable` | Boolean | Enable clicks and events on date cell, you can receive `input` event with dateObject (see `v-model`)  |
| `nav-date-format` | String | Navigation header Date Format for [luxon.DateTime.toFormat](https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html#instance-method-toFormat), default 'dd MMMM yyyy' |
| `first-day-of-week` | Number | 0-6, 0 - Sunday, 1 Monday, …. Same [Datetime Picker](https://quasar-framework.org/components/datetime-picker.html). Replace `sunday-first-day-of-week`  |
| `format24h` | Boolean | Override default i18n setting. Use 24 hour time for Material picker instead of AM/PM system which is default. Same [Datetime Picker](https://quasar-framework.org/components/datetime-picker.html)  |
| `calendar-locale` | String | A string setting the locale. We use the Luxon package for this and they describe how to set this [here](https://moment.github.io/luxon/docs/manual/intl.html). This will default to the user's system setting. |
| `calendar-timezone` | String | Manually set the timezone for the calendar. Many strings can be passed in including `UTC` or any valid [IANA zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). This is better explained [here](https://moment.github.io/luxon/docs/manual/zones.html). |
| `day-display-start-hour` | Number| Will scroll to a defined start hour when a day / multi-day component is rendered. Pass in the hour of the day from 0-23, the default being `7`. Current has no effect on the `CalendarAgenda` component. |

### Events

| Event | Parameters | Desription |
| --- | --- | --- |
| `@input` | Date Object | On change workingDate (Also use v-model instead :value and @input) |
| `@click-event` | Event Object | On click by event |

In addition, each individual components have the following properties:

### Editing (not yet)

To edit event, you must set property `editing` on `QEventCalendarModalDetail` component

Typical usage:

```html
    <q-event-calendar-month
      :clickable="true"
      v-model="workingDate"
      @click-event="detailEventObject = $event.target.value"
    />

    <q-event-calendar-modal-detail
      :editing="true"
      v-model="detailEventObject"
      @update="updateAction"
    />
```
See sample in source `Calendar.vue`

## QEventCalendar
| Vue Property | Type | Description |
| --- | --- | --- |
| `tab-labels` | Object | Passing in an object with strings that will override the labels for the different calendar components. Set variables for `month`, `week`, `threeDay`, `day` and `agenda`. Eventually we will replace this with language files and will use the `calendar-locale` setting. |

## QEventCalendarMultiDay

| Vue Property | Type | Description |
| --- | --- | --- |
| `num-days` | Number | The number of days the multi-day calendar. A value of `1` will change the header to be more appropriate for a single day. |
| `nav-days` | Number | This is how many days the previous / next navigation buttons will jump. |
| `force-start-of-week` | Boolean | Default is `false`. This is appropriate if you have a week display (7 days) that you want to always start on the first day of the week. |

## QEventCalendarAgenda

| Vue Property | Type | Description |
| --- | --- | --- |
| `num-days` | Number | The number of days to initially display and also the number of additional days to load up when the user scrolls to the bottom of the agenda. |
| `agenda-style` | String | Defaults to "dot". You can also set this as "block" to use an infinite scroll design that is meant for mobile use. |
| `scroll-height` | String | Defaults to `200px`, this is meant to define the size of the "block" style. |

## QEventCalendarModalDetail

### Properties

| Property | Type | Description |
| --- | --- | --- |

## Events

| Event | Parameters | Desription |
| --- | --- | --- |


##TODO

* Make computed events objects for cache and optimize perfomace, now recalculate on every render
* Separete QEventCalendarModalDetel to Modal and Detail, for possible using Detail with vue routing instad QModal
* Don't work editing now
