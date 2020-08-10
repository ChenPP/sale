<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">
      <b-navbar-brand href="#" class="bg-transparent shadow-none p-0">NavBar</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form> -->
          <!-- <b-nav-item-dropdown text="Lang" right>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown> -->
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
              <b-badge variant="success" pill>{{this.cartData.length}}</b-badge>
            </b-nav-item>
          </b-navbar-nav>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    TODO: 增加Vuex後要移動到sidebar
    <b-sidebar id="sidebar-right" title="購物車" shadow @hidden="cartHide">
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
          <b-spinner type="grow" class="m-5" variant="info"></b-spinner>
        </div>
        <div v-show="!footerLoading">
          <div >
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
            <strong class="mr-auto">折扣價格
              <span class="text-danger">{{checkout.final_total | currency}}</span>
            </strong>
          </div>
          <div class="d-flex align-items-center px-3 py-2">
            <strong class="mr-auto">全部金額
              <span class="text-danger">{{checkout.total | currency}}</span>
            </strong>
            <b-button variant="danger" size="sm" @click="checkoutMethod(hide)">結帳</b-button>
          </div>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import moment from 'moment';

export default {
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
    }
  },
  created() {
    const api = `${process.env.VUE_APP_API}/api/user/check`;
    this.$http.post(api).then((response) => {
      console.log(response.data)
      if (response.data.success) {
        this.loginStatus = true;
      } else {
        this.loginStatus = false;
      }
    })
    // this.openCart();
  },
  methods: {
    openCart() {
      console.log('⛑️: openCart -> openCart');
      Promise.all([this.getCart(), this.getCouponList()]).then(
        res => {
          console.log('結束', res);
        })
    },
    resetData() {
      this.cartData = [];
      this.checkout = {};
      this.selectedCoupon = '請選擇優惠卷';
      this.couponList = [];
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
      console.log('⛑️: 1111111 -> getCart');
      return new Promise(resolve => {
        const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
        this.$http.get(url).then((res) => {
          // console.log('⛑️: getCart -> res', res);
          if(res.data.success) {
            const data =   res.data.data.carts;
            this.checkout = res.data.data;
            this.cartData = data.reduce((pre, item) => {
              return [...pre, {...item.product, ...item}];
            }, []);
            this.tableLoading = false;
            resolve('11111getCouponList');
          }
        });
      }) 
    },
    checkoutMethod (colse) {
      console.log('先結帳');
      colse();
    },
    cartHide() {
      console.log("隱藏");
      this.tableLoading = true;
    },
    deleteItem(data) {
      this.tableLoading = true;
      console.log('⛑️: deleteItem -> data', data);
      const id = data.item.id;
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      this.$http.delete(api).then((res) => {
        if (res.data.success) {
          this.getCart();
        }
      })
    },
    getCouponList() {
      console.log('⛑️: 222222 -> getCouponList');
      return new Promise(resolve => {
        const momentToday = Date.parse(moment().format("YYYY-MM-DD")) / 1000
        console.log('⛑️: getCouponList -> momentToday', momentToday);
        const url =
          `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons`;
        this.$http.get(url).then((res) => {
          if (res.data.success) {
            let data = res.data.coupons;
            const newData = data.reduce((pre, item) => {
              console.log('⛑️: getCouponList -> item.due_date', item.due_date);
              if(item.due_date >= momentToday) {
                console.log('優惠卷還可以用!!!');
                return [...pre, {...item}];
              } else return pre;
            }, []);
            console.log('⛑️: getCouponList -> newData', newData);
            this.couponList = newData;
            resolve('22222getCouponList');
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
    }
  }
}
</script>

