
class Branch {
  constructor({ id, restaurant, schedule, address } = {}) {
    this._id = id;
    this._restaurant = restaurant;
    this._schedule = schedule;
    this._address = address;
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

  get address() {
    return this._address;
  }

  isOpen(moment) {
    moment = moment || new Date(); // This must be in UTC
    const day = Branch.days[moment.getDay()];
    const intervals = this._schedule.week[day] || [];
    const hour = moment.getUTCHours();

    return intervals.some(([open, close]) => hour >= open && hour < close);
  }
}

module.exports = Branch;
