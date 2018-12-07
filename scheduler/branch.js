class Branch {
  constructor({ id, name, restaurant, schedule, address } = {}) {
    this._id = id;
    this._restaurant = restaurant;

    this.name = name;
    this.schedule = schedule;
    this.address = address;
  }

  static get days() {
    return [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
  }

  get id() {
    return this._id;
  }

  get restaurant() {
    return this._restaurant;
  }

  isOpen(moment) {
    moment = moment || new Date(); // This must be in UTC
    const day = Branch.days[moment.getDay()];
    const shifts = this.schedule.week[day] || [];
    const hour = moment.getUTCHours();

    return shifts.some(([start, end]) => hour >= start && hour < end);
  }

  getShift(moment) {
    moment = moment || new Date();
    const day = Branch.days[moment.getDay()];
    const shifts = this.schedule.week[day] || [];
    const currentHours = moment.getUTCHours();

    for (const [start, end] of shifts) {
      if (currentHours >= start && currentHours < end) {
        return { start, end };
      }
    }
  }
}

module.exports = Branch;
