Component({
  properties: {
    tabIndex: Number
  },
  data: {
  },
  methods: {
    changeTab (event) {
      this.triggerEvent('tabClick', {index: event.currentTarget.dataset.tab})
    }
  }
})