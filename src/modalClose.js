export default {
  methods: {
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function () {
          target.removeEventListener(eventType, callback)
        }
      })
    }
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach(function (eventRemover) {
        eventRemover.remove()
      })
    }
  }
}