<template>
  <div>
    <b-table
      :busy.sync="isBusy"
      ref="selectableTable"
      selectable
      :items="items"
      :fields="fields"
      @row-selected="onRowSelected"
      responsive="sm"
      caption-top
    >
      <template v-slot:table-caption>訂單列表</template>
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <!-- 日期 -->
      <template v-slot:cell(create_at)="row">
        <span>{{$moment.unix(row.item.create_at).format("YYYY-MM-DD")}}</span>
      </template>
      <template v-slot:cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      isBusy: false,
      // fields: ['selected', 'num', 'create_at', 'is_paid', 'total'],
      fields: [
        {
          key: 'selected',
          label: '選擇',
        },
        {
          key: 'num',
          label: '編號',
          sortable: true,
        },
        {
          key: 'create_at',
          label: '訂單日期',
          sortable: true,
        },
        {
          key: 'is_paid',
          label: '付款',
        },
        {
          key: 'total',
          label: '總金額'
        }
      ],
      items: [],
      selected: []
    }
  },
  created() {
    // this.isBusy = true,
    this.getOrders();
  },
  methods: {
    onRowSelected(items) {
      this.selected = items
    },
    toggleBusy() {
      this.isBusy = !this.isBusy;
    },
    async getOrders(page = 1) {
      this.isBusy = true;
      console.log('🚀 ~ file: OrderList.vue ~ line 67 ~ this.isBusy ', this.isBusy )
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/orders/?page=${page}`;
      await this.$http.get(api).then((response) => {
        console.log('getOrders --- ', response.data)
        if (response.data.success) {
          this.items = response.data.orders;
        } else {
          console.log('🚀 ~ file: error');
        }
      });
      this.isBusy = false;
    },
  }
}
</script>
