<template>
  <div class="full-calendar-body" @click="hideInfo" style="`background-color: 'rgba(0,0,0,0.9)';`">
    <div class="weeks">
      <template v-for="(week, idx) in currentDates">
        <template v-for="(day, idx2) in week">
          <strong
            class="week"
            :key="`${idx}-${idx2}`"
            :class="{
              'is-sunday' : !idx2 % 7,
            }"
            v-if="day.isCurMonth"
          >{{ weekNames[idx2 % 7] }}</strong>
        </template>
      </template>
    </div>
    <div class="dates" ref="dates">
      <div class="dates-bg">
        <div class="week-row">
          <template v-for="(week, idx) in currentDates">
            <template v-for="(day, idx2) in week">
              <div
                v-if="day.isCurMonth"
                class="day-cell"
                :key="`${idx}-${idx2}`"
                ref="dayCellRef"
                :class="{
                  'not-cur-month' : !day.isCurMonth,
                }"
                :style="`z-index:${100 - (idx * 10 + idx2)}`"
              >
                <div class="left-itme-list">
                  <p class="day-number" :class="{'today' : day.isToday}">
                    <span>{{ day.monthDay }}</span>
                  </p>
                  <p
                    class="event-item"
                    :key="idx"
                    v-for="(event, idx) in day.events"
                    :class="[classNames(event.cssClass), {
                      'is-start': isStart(event.start, day.date),
                      'is-end': isEnd(event.end,day.date),
                      'is-zero': event.end === event.start,
                      'is-opacity': !event.isShow
                    }]"
                    @click="eventClick(event,$event, idx)"
                  >
                    <template v-if="day.isCurMonth">
                      <span
                        :class="['day-text']"
                        v-if="isStart(event.start, day.date)"
                        :style="`backgroundColor: ${computedColor(event.title)}`"
                      >{{ isBegin(event, day.date, day.weekDay) }}</span>
                      <span
                        :class="['name-taxt']"
                        v-if="isStart(event.start, day.date)"
                        :style="{width: cutTitle(this,event.start)}"
                      >{{ event.title }}</span>
                      <span
                        class="color-block"
                        :style="`backgroundColor: ${tinycolor(computedColor(event.title)).setAlpha(0.4).toRgbString()}`"
                      ></span>
                    </template>
                  </p>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- full events when click show more -->
      <transition name="fade">
        <div
          class="event-info"
          v-show="showInfo"
          :style="{left: morePos.left + 'px', top: morePos.top + 'px'}"
        >
          <div class="wrap" :style="`border-color: ${infoColor};`">
            <div>名称: {{ eventInfo.title }}</div>
            <div>开始: {{ eventInfo.start }}</div>
            <div>结束: {{ eventInfo.end }}</div>
          </div>
          <!-- <span class="info-color" :style="`background-color: rgb(${infoColor});`"></span> -->
        </div>
      </transition>

      <slot name="body-card"></slot>
    </div>
  </div>
</template>
<script type="text/babel">
import dateFunc from "./dateFunc";
import tinycolor from "tinycolor2";
const _idColorMap = {};
const _computedColor = (() => {
  const colorArr = [
    [238, 88, 114],
    [137, 229, 244],
    [32, 149, 242],
    [51, 51, 51],
    [126, 126, 198],
    [59, 152, 155],
    [86, 120, 163],
    [242, 122, 123],
    [255, 217, 96]
  ];
  let nonius = 0;
  const len = colorArr.length;
  return title => {
    if (_idColorMap[title]) {
      return _idColorMap[title];
    } else {
      _idColorMap[title] = `rgb(${colorArr[nonius % len].join(",")})`;
      nonius++;
      return _idColorMap[title];
    }
  };
})();
export default {
  props: {
    currentDate: {
      type: Date
    },
    events: {
      type: Array,
      default() {
        return [];
      }
    },
    weekNames: {
      type: Array,
      default() {
        return [];
      }
    },
    monthNames: { type: Array },
    firstDay: {
      type: Number
    }
  },
  data() {
    return {
      // weekNames : DAY_NAMES,
      weekMask: [1, 2, 3, 4, 5, 6, 7],
      spanArr: [],
      isLismit: true,
      eventLimit: 3,
      showInfo: false,
      eventInfo: {},
      localEvents: null,
      morePos: {
        top: 0,
        left: 0
      },
      selectDay: {},
      infoColor: {},
      idColorMap: {},
      cellWidth: 50,
      reload: true
    };
  },
  computed: {
    currentDates() {
      return this.getCalendar();
    }
  },
  created() {
    this.computedColor = _computedColor;
    this.idColorMap = _idColorMap;
    this.localEvents = this.deepClone(this.events).map((item, index) => {
      item.id = item.id || index;
      item.end = item.end || item.start;
      return item;
    });
    // console.log(this.localEvents);
    const _svgs = document.getElementsByClassName("svg-comp");
    setTimeout(() => {
      for (let i = 0; i < _svgs.length; i++) {
        const _sv = _svgs[i];
        _sv.style.width = "100%";
      }
    });
  },
  mounted() {
    this.cellWidth = this.$refs.dayCellRef[0].getBoundingClientRect().width;
  },

  methods: {
    tinycolor,
    cutTitle(is, start) {
      // console.log(is, start);
    },
    deepClone(obj) {
      const _obj = JSON.stringify(obj);
      const objClone = JSON.parse(_obj);
      return objClone;
    },
    isBegin(event, date, index) {
      const st = new Date(event.start);
      if (
        index === 0 ||
        st.toDateString() === date.toDateString() ||
        date.getDate() === 1
      ) {
        return st.getDate();
      }
      return "";
    },
    computedDistanceDate(currentDate, startDateStr, endDateStr) {
      const startDay = startDateStr.split("-");
      startDay[1] -= 1;
      const endDay = endDateStr.split("-");
      endDay[1] -= 1;
      // debugger;
      // 全部多少天
      const allDays =
        this.getCurrentDay(new Date(...endDay)) -
        this.getCurrentDay(new Date(...startDay)) +
        1;
      // 距离开始多少天
      const disStart =
        this.getCurrentDay(currentDate) -
        this.getCurrentDay(new Date(...startDay));
      return {
        allDays,
        disStart
      };
    },
    computedOpacity(currentDate, startDateStr, endDateStr, start) {
      if (startDateStr === endDateStr) return 1.0;
      const opcitySection = 0.1;
      const { allDays, disStart } = this.computedDistanceDate(
        currentDate,
        startDateStr,
        endDateStr
      );
      return start === "start"
        ? (1 - (opcitySection / allDays) * disStart).toFixed(4)
        : (1 - (opcitySection / allDays) * (disStart + 1)).toFixed(4);
    },
    computedPoints(currentDate, startDateStr, endDateStr) {
      const height = 35;
      const minHeight = 35;
      const width = this.cellWidth;
      const disHeight = height - minHeight;
      const { allDays, disStart } = this.computedDistanceDate(
        currentDate,
        startDateStr,
        endDateStr
      );
      const base = disHeight / allDays / 2;
      const leftY = base * disStart;
      const rightY = base * (disStart + 1);
      // 零天残留不显示
      if (allDays === 1) return "";
      return `0,${leftY} ${width},${rightY} ${width},${height -
        rightY} 0,${height - leftY}`;
    },
    computedTrapezoid(currentDate, startDateStr, endDateStr, direction) {
      const height = 18;
      const minHeight = 6;
      const disHeight = height - minHeight;
      const { allDays, disStart } = this.computedDistanceDate(
        currentDate,
        startDateStr,
        endDateStr
      );
      const base = disHeight / allDays / 2;
      const distance = base * disStart;
      return direction === "top"
        ? `height: ${distance}px;border-bottom: ${base}px solid transparent;border-top: 0px solid transparent;`
        : `height: ${distance}px;border-top: ${base}px solid transparent;border-bottom: 0px solid transparent;`;
    },
    getCurrentDay(date) {
      const endDate = new Date(date);
      const startDate = new Date(2016, 0, 0);
      const days = (endDate - startDate) / 1000 / 60 / 60 / 24;
      return days;
    },
    moreTitle(date) {
      const dt = new Date(date);
      return (
        this.weekNames[dt.getDay()] +
        ", " +
        this.monthNames[dt.getMonth()] +
        dt.getDate()
      );
    },
    classNames(cssClass) {
      if (!cssClass) return "";
      // string
      if (typeof cssClass === "string") return cssClass;

      // Array
      if (Array.isArray(cssClass)) return cssClass.join(" ");

      // else
      return "";
    },
    getCalendar() {
      // calculate 2d-array of each month
      // first day of this month
      const now = new Date(); // today
      const current = new Date(this.currentDate);

      const startDate = dateFunc.getStartDate(current); // 1st day of this month

      const curWeekDay = startDate.getDay();

      // begin date of this table may be some day of last month
      let diff = parseInt(this.firstDay) - curWeekDay;
      diff = diff > 0 ? diff - 7 : diff;

      startDate.setDate(startDate.getDate() + diff);
      const calendar = [];

      for (let perWeek = 0; perWeek < 6; perWeek++) {
        const week = [];

        for (let perDay = 0; perDay < 7; perDay++) {
          week.push({
            monthDay: startDate.getDate(),
            isToday: now.toDateString() === startDate.toDateString(),
            isCurMonth: startDate.getMonth() === current.getMonth(),
            weekDay: perDay,
            date: new Date(startDate),
            events: this.slotEvents(startDate)
          });

          startDate.setDate(startDate.getDate() + 1);
          // if (startDate.toDateString() === endDate.toDateString()) {
          //   isFinal = true
          //   break
          // }
        }
        calendar.push(week);
        // if (isFinal) break
      }
      return calendar;
    },
    slotEvents(date) {
      // find all events start from this date
      // const cellIndexArr = [];
      // 筛选事件大集合的事件到当前日期
      const thisDayEvents = this.localEvents.filter(day => {
        const dt = new Date(day.start);
        const st = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        const ed = day.end ? new Date(day.end) : st;
        // // console.log('slotEvt', st, ed, date)
        return date >= st && date <= ed;
      });

      // sort by duration
      thisDayEvents.sort((a, b) => {
        if (!b.cellIndex) return -1;
        if (!a.cellIndex) return 1;
        return a.cellIndex - b.cellIndex;
      });

      // mark cellIndex and place holder
      for (let i = 0; i < thisDayEvents.length; i++) {
        thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || i + 1;
        thisDayEvents[i].isShow = true;
        if (thisDayEvents[i].cellIndex === i + 1 || i > 100) continue;
        thisDayEvents.splice(i, 0, {
          title: "holder",
          cellIndex: i + 1,
          start: dateFunc.format(date, "yyyy-MM-dd"),
          end: dateFunc.format(date, "yyyy-MM-dd"),
          isShow: false
        });
      }
      // debugger
      return thisDayEvents;
    },
    isStart(eventDate, date) {
      const st = new Date(eventDate);
      return st.toDateString() === date.toDateString();
    },
    isEnd(eventDate, date) {
      const ed = new Date(eventDate);
      return ed.toDateString() === date.toDateString();
    },
    selectThisDay(day, jsEvent) {
      this.selectDay = day;
      this.showMore = true;
      this.morePos = this.computePos(event.target);
      this.morePos.top -= 100;
      const events = day.events.filter(item => {
        return item.isShow === true;
      });
      this.$emit("moreclick", day.date, events, jsEvent);
    },
    computePos(target) {
      const eventRect = target.getBoundingClientRect();
      const pageRect = this.$refs.dates.getBoundingClientRect();
      return {
        left: eventRect.left - pageRect.left,
        top: eventRect.top + eventRect.height - pageRect.top
      };
    },
    dayClick(day, jsEvent) {
      this.$emit("dayclick", day, jsEvent);
    },
    eventClick(event, jsEvent, idx) {
      // console.log(event.id);
      // console.log(event);

      if (!event.isShow) {
        return;
      }
      const sameDay = event.start === event.end;
      this.infoColor = !sameDay ? this.idColorMap[event.title] : "0,0,0";
      this.showInfo = true;
      this.eventInfo = event;
      // console.log(event);

      this.morePos = this.computePos(jsEvent.target);
      this.morePos.left -= 50;
      if (this.morePos.left < -10) this.morePos.left += 50;
      if (this.morePos.left > 250) this.morePos.left -= 40;
      jsEvent.stopPropagation();
    },
    hideInfo() {
      this.showInfo = false;
    }
  }
};
</script>
<style lang="scss">
$border-color: #c2c2c2;

.full-calendar-body {
  // height: 100%;
  .is-sunday {
    // background-color: #0066cc;
    color: #cc4343 !important;
  }

  svg {
    position: relative;
    display: inline-block;
    width: 0%;
    transition: width ease-in 0.5s;
  }

  .weeks {
    display: flex;

    & > div {
      display: flex;
      flex: 1;
    }

    .week {
      flex: 1;
      text-align: center;
      // height: 20px;
      line-height: 20px;
      color: #777;
    }
  }

  .dates {
    position: relative;
    height: 100%;

    .dates-bg {
      display: flex;
    }

    .event-item {
      position: relative;
      cursor: pointer;
      font-size: 12px;
      margin-top: 6px;
      color: #fff;
      height: 24px;
      line-height: 24px;
      white-space: nowrap;
      z-index: 2;
      margin-right: -1px;
      // box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.1);
      .day-text {
        position: absolute;
        // padding-left: 6px;
        box-sizing: border-box;
        z-index: 100;
        // text-shadow: 1px 1px #333;
        color: #fff;
        left: 3px;
        top: 3px;
        transition: left ease 1.5s;
        border-radius: 50%;
        height: 18px;
        line-height: 18px;
        width: 18px;
        text-align: center;
        background-color: #fff;
        font-size: 12px;
        font-weight: 900;
      }
      .name-taxt {
        position: absolute;
        left: 28px;
        // text-shadow: 1px 1px #fff;
        color: #333;
      }
      &.red {
        color: #fff;
        background-color: rgb(237, 84, 100);
      }

      &.green {
        color: #fff;
        // background-color: rgb(26, 179, 148);
        background-color: rgb(35, 198, 200);
      }

      &.logo {
        color: #fff;
        // background-color: rgb(26, 179, 148);
        background-color: #d2b697;
      }

      &.yellow {
        color: #fff;
        background-color: rgb(248, 172, 89);
      }

      &.blue {
        color: #fff;
        background-color: rgb(28, 132, 198);
      }

      &.is-start {
        margin-left: 4px;
        .color-block {
          border-radius: 12px 0 0 12px;
        }
      }

      &.is-end {
        margin-right: 4px;
        .color-block {
          border-radius: 0 12px 12px 0;
        }
      }

      &.is-opacity {
        opacity: 0;
      }
      &.is-zero {
        box-sizing: border-box;
        color: #333;
        .color-block {
          border-radius: 12px 0 0 12px;
        }
      }
      .triangle-left {
        position: absolute;
        top: 0;
        left: -8px;
        display: inline-block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 9px 8px 9px 0;
        border-color: transparent #007bff transparent transparent;
      }

      .triangle-left-end {
        left: auto;
        right: 0;
        border-width: 9px 15px 9px 0;
        border-color: transparent #fff transparent transparent;
      }
      .color-block {
        display: inline-block;
        height: 100%;
        width: 100%;
      }
    }

    .week-row {
      display: flex;
      flex: 1;

      .day-cell {
        position: relative;
        flex: 1;
        min-height: 80px;
        padding: 4px 0;
        box-sizing: border-box;

        .day-number {
          box-sizing: border-box;
          padding: 0 4px;
        }

        .left-itme-list {
          z-index: 5;
          position: relative;
        }

        .right-border {
          position: absolute;
          top: 0;
          right: 0;
          width: 1px;
          background-color: #e0e0e0;
          height: 100%;
          z-index: 0;
        }

        .day-number {
          text-align: right;
          font-size: 16px;

          span {
            // display: inline-block;
            // width: 20px;
            height: 20px;
            // padding: 0 2px;
            line-height: 20px;
            border-radius: 10px;
            text-align: center;
          }
        }

        .today {
          // color: #fff;

          // // font-size: 20px;

          // background-color: #ed5464;
        }

        &.not-cur-month {
          .day-number {
            color: rgba(0, 0, 0, 0.24);
          }
        }
      }
    }

    .dates-events {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;

      .events-week {
        display: flex;

        .events-day {
          cursor: pointer;
          flex: 1;
          min-height: 109px;
          overflow: hidden;
          text-overflow: ellipsis;

          .day-number {
            text-align: right;
            padding: 4px 5px 4px 4px;
            opacity: 0;
          }

          &.not-cur-month {
            .day-number {
              color: rgba(0, 0, 0, 0.24);
            }
          }

          .event-box {
            .more-link {
              cursor: pointer;
              // text-align: right;
              padding-left: 8px;
              padding-right: 2px;
              color: rgba(0, 0, 0, 0.38);
              font-size: 14px;
            }
          }
        }
      }
    }

    .event-info {
      position: absolute;
      top: 0px;
      left: 0;
      box-sizing: border-box;
      padding: 5px;
      font-size: 14px;
      background-color: #fff;
      box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.1);
      z-index: 9999;
      border: 1px solid #e2e2e2;
      color: #777;
      .wrap {
        border-left: 4px solid;
        box-sizing: $border-color;
        padding-left: 4px;
      }
      .info-color {
        position: absolute;
        left: 4px;
        top: 4px;
        display: inline-block;
        width: 4px;
        height: 100%;
        border-radius: 5px;
        background-color: deeppink;
      }
    }
  }
}

/*0.3像素下划线边框*/

.borderBottom {
  position: relative;
  overflow: hidden;
}

.borderBottom::after {
  content: "";
  position: absolute;
  width: 500%;
  left: 0;
  bottom: -1px;
  right: 0;
  border: 1px solid #e2e2e2;
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(0.3, 0.3);
  -ms-transform: scale(0.3, 0.3);
  -o-transform: scale(0.3, 0.3);
  transform: scale(0.3, 0.3);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.thinner-border-right {
  position: relative;
}

.thinner-border-right:before {
  content: "";
  position: absolute;
  width: 500%;
  height: 200%;
  border-right: 1px solid #e2e2e2;
  -webkit-transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -ms-transform-origin: 0 0;
  -o-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scale(0.5, 0.5);
  -ms-transform: scale(0.5, 0.5);
  -o-transform: scale(0.5, 0.5);
  transform: scale(0.5, 0.5);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.trapezoid-mask {
  position: absolute;
  left: 0;
  width: 0;
  border-right: 50.58px solid #000;
}

.trapezoid-top-mask {
  top: 0;
}

.trapezoid-bottom-mask {
  bottom: 0px;
}

.weeks {
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  border-left: 1px solid $border-color;

  .week {
    color: #bbb;
    border-right: 1px solid $border-color;
  }
}

.week-row {
  border-left: 1px solid $border-color;

  .day-cell {
    border-right: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
  }
}
</style>
