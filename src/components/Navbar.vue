<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">
      <b-navbar-brand href="#" class="bg-transparent shadow-none p-0">GOGO</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-navbar-nav>
            <b-nav-item href="#" class="center" @click.prevent="logOut">{{loginStatus? '登出' : '未登入'}}</b-nav-item>
            <b-nav-item>
              <b-icon
                icon="cart4"
                variant="light"
                class="mr-1"
                font-scale="1.5"
                v-b-toggle.sidebar-right
                @click="openCart">
              </b-icon>
              <!-- <b-badge variant="success" pill>{{this.cartData.length}}</b-badge> -->
              <b-badge variant="success" pill>{{customerOrders}}</b-badge>
            </b-nav-item>
          </b-navbar-nav>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    TODO: 增加Vuex後要移動到sidebar
    <b-sidebar id="sidebar-right" title="購物車" shadow backdrop @hidden="cartHide">
      <div class="px-3 py-2">
        <b-table
          striped
          hover
          borderless
          :busy="tableLoading"
          :fields="fields"
          :items="cartData">
          <template v-slot:table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle mr-1"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(editItem)="row">
            <b-button variant="outline-danger" size="sm">
              <b-icon icon="trash" aria-hidden="true" @click="deleteItem(row)"/>
            </b-button>
          </template>
        </b-table>
      </div>
      <template v-slot:footer="{ hide }">
        <div v-show="footerLoading">
          <b-spinner type="grow" class="m-5 align-middle" variant="info"/>
          <strong>Loading...</strong>
        </div>
        <div v-show="!footerLoading && !tableLoading">
          <div v-show="couponList.length">
            <b-dropdown
                :text="selectedCoupon"
                block
                split
                split-variant="outline-primary"
                variant="primary"
                class="m-2"
              >
              <b-dropdown-item
              href="#"
              @click="couponClick(item)"
              v-for="(item, index) in couponList"
              :key="index"
              >{{`${item.title} ${item.percent}％`}}
              </b-dropdown-item>
            </b-dropdown>
          </div>
          <div class="d-flex align-items-center px-3 py-2">
            <strong class="mr-auto">全部金額
              <span class="text-danger">{{checkout.total | currency}}</span>
            </strong>
          </div>
          <div v-if="couponSelected" class="d-flex align-items-center px-3 py-2">
            <strong class="mr-auto text-success">折扣價格
              <span class="text-danger">{{checkout.final_total | currency}}</span>
            </strong>
          </div>
          <div class="d-flex justify-content-end align-items-center px-3 py-2">
            <b-button
              variant="danger" size="sm"
              @click="checkoutMethod(hide)"
              >結帳</b-button>
          </div>
        </div>
      </template>
    </b-sidebar>
    <OrderUserModal></OrderUserModal>
  </div>
</template>

<script>
import moment from 'moment';
import { resolve } from 'url';
import OrderUserModal from '@/components/OrderUserModal.vue';

export default {
  components: {
    OrderUserModal,
  },
  data () {
    return {
      tableLoading: true,
      fields: [
        {
          key: 'title',
          label: '品名'
        },
        {
          key: 'qty',
          label: '數量'
        },
        {
          key: 'final_total',
          label: '單價',
          sortable: true,
          variant: 'danger'
        },
        {
          key: 'editItem',
          label: '編輯',
        }
      ],
      cartData: [],
      checkout: {},
      loginStatus: false,
      selectedCoupon: '請選擇優惠卷',
      couponList: [],
      footerLoading: false,
      couponSelected: false, //是否有套用優惠卷
      orderSuccess: null, // 訂單送出狀態
      customerOrders: 0, // 購物車裡商品數量
    }
  },
  // computed: {
  //   customerOrders () {
  //     this.$bus.$on('customerOrders', (status) => {
  //     this.customerOrders = status;
  //   });
  //   },
  // },
  watch: {
    // 訂單送出成功 關閉側欄
    orderSuccess () {
      this.getCart();
    },
  },
  created() {
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    this.$http.post(api).then((response) => {
      console.log('登入狀態', response.data)
      if (response.data.success) {
        this.loginStatus = true;
      } else {
        this.loginStatus = false;
      }
    })
  },
  mounted() {
    this.$bus.$on('orderSuccese', (status) => {
      this.orderSuccess = status;
    });
    this.$bus.$on('customerOrders', (status) => {
      this.customerOrders = status;
    });
  },
  destroyed() {
    console.log("🚀 ~ Navbar destroyed")
    this.$bus.$off();
  },
  methods: {
    async openCart() {
      Promise.all([this.getCart(), this.getCouponList()]).then(
        res => {
          console.log('openCart', res);
          console.log(this.couponList)
        })
    },
    resetData() {
      this.checkout = {};
      this.selectedCoupon = '請選擇優惠卷';
      this.couponList = [];
      this.couponSelected = false;
    },
    logOut () {
      const api = `${process.env.VUE_APP_API}/logout`;
      console.log('⛑️: 登出 -> api', api);
      this.$http.post(api).then((response) => {
        console.log(response.data)
        if (response.data.success) {
          this.$router.push('/login');
        }
      })
    },
    getCart() {
      this.tableLoading = true;
      return new Promise(resolve => {
        const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
        this.$http.get(url).then((res) => {
          if(res.data.success) {
            const data =   res.data.data.carts;
            this.checkout = res.data.data;
            this.cartData = data.reduce((pre, item) => {
              return [...pre, {...item.product, ...item}];
            }, []);
            this.tableLoading = false;
            const localData = JSON.parse(localStorage.getItem('LproductList'));
            this.$bus.$emit('customerOrders',localData ? localData.length : 0);
            resolve('getCart');
          }
        });
      }) 
    },
    checkoutMethod (colse) {
      this.$bvModal.show('userModal');
      // const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
      // this.$http.post(api, { data }).then((res) => {
      //   if (res.data.success) {
      //     this.getCart();
      //   }
      // })
      console.log('先結帳');
      // colse();
    },
    cartHide() {
      console.log('🚀 ~ file: Navbar.vue ~ line 219 ~ cartHide')
      this.resetData();
      this.tableLoading = true;
    },
    deleteItem(data) {
      this.tableLoading = true;
      console.log('⛑️: deleteItem');
      const id = data.item.id;
      console.log('🚀 ~ file: Navbar.vue ~ line 239 ~ id', id)
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      this.$http.delete(api).then((res) => {
        if (res.data.success) {
          const localData = JSON.parse(localStorage.getItem('LproductList'));
          console.log('🚀 ~ file: Navbar.vue ~ line 244 ~ localData', localData)
          if (localData) {
            const delItem = localData.map(items => items.product_id).indexOf(id);
            console.log('🚀 ~ file: Navbar.vue ~ line 244 ~ delItem', delItem,)
            localData.splice(delItem, 1);
            localStorage.setItem('LproductList', JSON.stringify(localData));
            console.log('🚀 ~ file: Navbar.vue ~ 刪除結束localData', localData)
          }
          this.getCart();
        }
      })
    },
    getCouponList() {
      return new Promise(resolve => {
        const momentToday = Date.parse(moment().format("YYYY-MM-DD")) / 1000
        const url =
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons`;
        this.$http.get(url).then((res) => {
          if (res.data.success) {
            let data = res.data.coupons;
            const newData = data.reduce((pre, item) => {
              if(item.due_date > momentToday && item.is_enabled) {
                console.log('⛑️: -> item.due_date', item.due_date, item.title);
                return [...pre, {...item}];
              }  else return pre;
            }, []);
            this.couponList = newData;
            resolve('getCouponList');
          }
        });
      })
    },
    couponClick(item) {
      this.footerLoading = true;
      const data = { code: item.code };
      this.selectedCoupon = `${item.title} ${item.percent}％`;
      const url =
        `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
      this.$http.post(url, {data}).then((res) => {
        console.log('⛑️: couponClick -> res', res);
        if (res.data.success) {
          this.couponSelected = true;
          this.checkout.final_total = res.data.data.final_total;
        } else {
          this.$bus.$emit('alert-message', {
            messages: res.data.message,
            dismissSecs: 3,
            type: 'danger',
          });
        }
        this.footerLoading = false;
      });
    },
    resetModal() {
      console.log('Modal resetModal!');
    },
    okModal() {
      console.log('OKOK BTN');
    }
  }
}
</script>

