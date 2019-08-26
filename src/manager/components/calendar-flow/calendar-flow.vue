<template>
  <div class="comp-full-calendar">
    <div class="full-box-title">
      <div class="month">
        <span class="number">{{ currentDate.getMonth() + 1 }}</span> 月
      </div>
      <div class="year" v-if="idx === 0 || currentDate.getMonth() === 0">
        <span class="number-year">{{ currentDate.getFullYear() }}</span> 年
      </div>
    </div>
    <fc-body
      :current-date="currentDate"
      :events="events"
      :month-names="monthNames"
      :week-names="weekNames"
      :first-day="firstDay"
      @eventclick="emitEventClick"
      @dayclick="emitDayClick"
      @moreclick="emitMoreClick"
    >
      <div slot="body-card">
        <slot name="fc-body-card"></slot>
      </div>
    </fc-body>
  </div>
</template>
<script type="text/babel">
import langSets from "./dataMap/langSets";
import fcBody from "./components/body";

export default {
  components: {
    fcBody
  },
  props: {
    events: {
      // events will be displayed on calendar
      type: Array,
      default() {
        return [];
      }
    },
    lang: {
      type: String,
      default: "en"
    },
    idx: {
      type: Number,
      default: 0
    },
    firstDay: {
      type: Number | String,
      validator(val) {
        const res = parseInt(val);
        return res >= 0 && res <= 6;
      },
      default: 0
    },
    titleFormat: {
      type: String,
      default() {
        return langSets[this.lang].titleFormat;
      }
    },
    monthNames: {
      type: Array,
      default() {
        return langSets[this.lang].monthNames;
      }
    },
    weekNames: {
      type: Array,
      default() {
        const arr = langSets[this.lang].weekNames;
        return arr.slice(this.firstDay).concat(arr.slice(0, this.firstDay));
      }
    },
    date: {
      type: Date,
      default() {
        return new Date();
      }
    }
  },
  data() {
    return {
      currentDate: new Date(this.date)
    };
  },
  methods: {
    emitChangeMonth(start, end, currentStart, current) {
      // console.log('currentDate 2', this.currentDate);
      this.currentDate = current;
      // console.log('currentDate 3', this.currentDate);
      this.$emit("changeMonth", start, end, currentStart);
    },
    emitEventClick(event, jsEvent, pos) {
      this.$emit("eventClick", event, jsEvent, pos);
    },
    emitDayClick(day, jsEvent) {
      this.$emit("dayClick", day, jsEvent);
    },
    emitMoreClick(day, events, jsEvent) {
      this.$emit("moreClick", day, event, jsEvent);
    }
  }
};
</script>
<style lang="scss">
.comp-full-calendar {
  position: relative;
  // z-index: 999;
  padding: 10px;
  flex: 1;
  font-size: 14px;
  ul,
  p {
    margin: 0;
    padding: 0;
    font-size: 14px;
  }

  .full-box-title {
    // width: 80px;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    padding: 0 5px;
    font-size: 14px;
    // background-color: #d2b697;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin-bottom: 5px;
    overflow: hidden;
    .number {
      color: rgb(253, 149, 39);
      font-size: 36px;
      font-style: italic;
    }
    .number-year {
      font-size: 36px;
      font-style: italic;
      color: #50657b;
    }
    .month {
      float: left;
    }
    .year {
      float: right;
    }
  }
}
</style>
