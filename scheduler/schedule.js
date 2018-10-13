
class Schedule {
  constructor(week) {
    this._week = week || {
      sunday: [[9, 20]],
      monday: [[9, 20]],
      tuesday: [[9, 20]],
      wednesday: [[9, 20]],
      thursday: [[9, 20]],
      friday: [[9, 20]],
      saturday: [[9, 20]],
    };
  }

  get week() {
    return this._week;
  }
}

module.exports = Schedule;
