<template>
  <div>
    <calendar-flow
      lang="zh"
      :events="events"
      v-for="(item, idx) in showMonth"
      :key="idx"
      :idx="idx"
      :date="new Date(item.year, item.month - 1)"
      :id="`date-${item.year}-${item.month}`"
    ></calendar-flow>
  </div>
</template>
<script>
import calendarFlow from "../components/calendar-flow/calendar-flow";
export default {
  components: { calendarFlow },
  data() {
    return {
      showMonth: [],
      events: {}
    };
  },
  created() {
    let date = new Date(2018, 9);
    this.showMonth.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
    date = new Date(2018, 10);
    this.showMonth.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
    date = new Date(2018, 11);
    this.showMonth.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
    date = new Date(2018, 12);
    this.showMonth.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
    date = new Date(2019, 1);
    this.showMonth.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
    date = new Date(2019, 2);
    this.showMonth.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
    date = new Date(2019, 3);
    this.showMonth.push({
      year: date.getFullYear(),
      month: date.getMonth()
    });
    this.getEvents();
  },
  mounted() {},
  methods: {
    completion(num, count) {
      const numStr = num + "";
      return numStr.length < 2 ? "0" + numStr : numStr;
    },
    sameDay(date1, date2) {
      return (
        [
          date1.getFullYear(),
          this.completion(date1.getMonth() + 1),
          this.completion(date1.getDate())
        ].join("-") ===
        [
          date2.getFullYear(),
          this.completion(date2.getMonth() + 1),
          this.completion(date2.getDate())
        ].join("-")
      );
    },
    getEvents() {
      const oneDay = 1000 * 60 * 60 * 24;
      // let debug = false;
      const res = [{}, {}, {}];
      res[0].addDate = new Date(2019, 1, 12).getTime();
      res[0].remainPeriodEndDate = new Date(2019, 1, 23).getTime();
      res[1].addDate = new Date(2018, 9, 23).getTime();
      res[1].remainPeriodEndDate = new Date(2018, 10, 23).getTime();
      res[2].addDate = new Date(2018, 11, 23).getTime();
      res[2].remainPeriodEndDate = new Date(2018, 12, 23).getTime();

      const _obj = res.map(val => {
        const startDate = new Date(val.addDate);
        let endDate = new Date(val.remainPeriodEndDate);
        if (!this.sameDay(startDate, endDate)) {
          endDate = new Date(val.remainPeriodEndDate - oneDay);
        }
        return {
          title: val.pesticideName || "title",
          pesticideId: val.pesticideId,
          start: [
            startDate.getFullYear(),
            this.completion(startDate.getMonth() + 1),
            this.completion(startDate.getDate())
          ].join("-"),
          end: [
            endDate.getFullYear(),
            this.completion(endDate.getMonth() + 1),
            this.completion(endDate.getDate())
          ].join("-")
        };
      });
      if (JSON.stringify(this.events) !== JSON.stringify(_obj)) {
        this.events = _obj;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
