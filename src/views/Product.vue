<template>
  <div>
    <div>
      <b-button variant="outline-primary" @click="openModal" class="mt-4">建立新產品</b-button>
    </div>
    <!-- TODO: table用 -->
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="80">其他</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in list" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right">{{item.origin_price}}</td>
          <td class="text-right">{{item.price}}</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td>
            <b-button variant="outline-primary" size="sm">編輯</b-button>
          </td>
        </tr>
      </tbody>
    </table>
    <b-modal id="new-modal" title="新增產品 " @ok="check" @cancel="cancel">
      <div>
        <b-form ref="form" @submit.stop.prevent="check">
          <b-form-group
            v-for="(item, index) in newConfig" :key="index"
            :label="item.label"
          >
            <b-form-file
              v-if="item.type === 'file'"
              v-model="item.value" class="mt-3" plain>
            </b-form-file>
            <b-form-input
              v-else-if="(item.type === 'text' && item.label !== '產品描述' && item.label !== '說明內容')
                || item.type === 'url'"
              v-model="item.value"
              :placeholder="item.placeholder"
              :type="item.type"
            ></b-form-input>
            <b-form-input
              v-else-if="item.type === 'number'"
              v-model.number="item.value"
              type="number"
              step="any"
            ></b-form-input>
            <b-form-textarea
              v-else-if="item.label === '產品描述' || item.label === '說明內容'"
              v-model="item.value"
              :placeholder="item.placeholder"
              rows="3"
              max-rows="6"
            ></b-form-textarea>
            <b-form-checkbox
              v-else-if="item.type === 'checkbox'"
              v-model="item.value"
            >
              啟用
            </b-form-checkbox>
          </b-form-group>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data ()  {
    return {
      list: [],
      formData: {
        imageUrl: '',
        image: null,
        title: '',
        category: '',
        unit: '個',
        originPrice: 0,
        price: 0,
        description: '',
        content: '',
        is_enabled: 1,
      },
      newConfig: [
        {
          label: '輸入網址',
          type: 'url',
          key: 'imageUrl',
          value: '',
          placeholder: '輸入圖片網址',
        },
        {
          label: '上傳圖片',
          type: 'file',
          key: 'image',
          value: null,
          placeholder: '選擇圖片',
        },
        {
          label: '標題',
          type: 'text',
          key: 'title',
          value: '',
          placeholder: '請輸入標題',
        },
        {
          label: '分類',
          type: 'text',
          key: 'category',
          value: '',
          placeholder: '請輸入分類',
        },
        {
          label: '單位',
          type: 'text',
          key: 'unit',
          value: '個',
          placeholder: '請輸入單位',
        },
        {
          label: '原價',
          type: 'number',
          key: 'originPrice',
          value: 0,
          placeholder: '請輸入原價',
        },
        {
          label: '售價',
          type: 'number',
          key: 'price',
          value: 0,
          placeholder: '請輸入售價',
        },
        {
          label: '產品描述',
          key: 'description',
          value: '',
          placeholder: '請輸入產品描述',
        },
        {
          label: '說明內容',
          key: 'content',
          value: '',
          placeholder: '請輸入產品說明內容',
        },
        {
          label: '是否啟用',
          type: 'checkbox',
          key: 'is_enabled',
          value: true,
        },
      ],
    };
  },
  created () {
    this.getList();
  },
  methods: {
    getList () {
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products`;
      console.log('⛑️: created -> api', api);
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.list = response.data.products;
          console.log('⛑️: list', this.list);
        }
      })
    },
    openModal () {
      this.$bvModal.show('new-modal');
    },
    check () { 
      Object.keys(this.formData).map((key) => {
        this.newConfig.forEach((item) => {
          if (item.key === key) {
            if (item.key === 'is_enabled') {
              item.value = item.value ? 1 : 0;
            }
            this.formData[key] = item.value;
          }
        })
      })
      const data = { data: this.formData };
      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
      console.log('⛑️: created -> api', data);
      this.$http.post(api, data).then((response) => {
        if (response.data.success) {
          this.list = response.data.products;
          console.log('⛑️: ', response);
        }
      })
    },
    cancel () {
      console.log('Cancel');
    }
    
  },
}
</script>