<template>
  <div class="message-alert">
    <b-alert
      :show="dismissCountDown"
      :variant="alertData.type"
      dismissible
      @dismiss-count-down="countDownChanged"
      >
      {{alertData.messages}}
    </b-alert>
  </div>
</template>
<script>
export default {
  data() {
    return {
      alertData: {
        messages: '預設提示內容',
        dismissSecs: 5, // 預設提示時間
        type: 'warning',
      },
      dismissCountDown: 0,
    };
  },
  created() {
    this.$bus.$on('alert-message', (alert) => {
      this.updateMessage(alert);
    });
  },
  methods: {
    updateMessage(alert) {
      console.log('⛑️: updateMessage -> alert', alert);
      this.alertData = { ...this.alertData, ...alert};
      this.dismissCountDown = this.alertData.dismissSecs;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
  }
}
</script>

<style scope>
.message-alert {
  position: fixed;
  max-width: 70%;
  top: 56px;
  right: 20px;
  z-index: 1100;
}
</style>