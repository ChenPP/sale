<template>
  <div>
    <b-modal
      id="userModal"
      ref="modal"
      title="填寫購買人資訊"
      hide-footer
    >
      <!-- @show="resetModal"
      @ok="handleOk" -->
      <validation-observer ref="observer" v-slot="{ handleSubmit }">
        <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
          <validation-provider
            v-for="(item, index) in items" :key="index"
            :name="item.key"
            :rules="item.rule"
            v-slot="validationContext">
            <b-form-group :label="item.label">
              <b-form-input
                name="example-input-1"
                v-model="item.value"
                :state="getValidationState(validationContext)"
                aria-describedby="input-1-live-feedback"
              ></b-form-input>
              <b-form-invalid-feedback>{{ validationContext.errors[0] }}</b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>
          <b-button type="submit" variant="primary">送出</b-button>
        </b-form>
      </validation-observer>
    </b-modal>
  </div>
</template>
<script>
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize
} from "vee-validate";
import { required, email, numeric } from 'vee-validate/dist/rules';

extend('email', {
  ...email,
  message: 'email不對啊？'
})

extend('numeric', {
  ...numeric,
  message: '號碼是數字ㄟ?'
})

extend('required', {
  ...required,
  message: '必填喔~'
});
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      items: [
        {
          key: 'name',
          label: '姓名',
          rule: { required: true },
          value: '',
          state: null,
        },
        {
          key: 'email',
          label: '信箱',
          rule: { required: true, email: true },
          value: '',
          state: null,
        },
        {
          key: 'tel',
          label: '手機',
          rule: { required: true, numeric: true },
          value: '',
          state: null,
        },
        {
          key: 'address',
          label: '居住地',
          rule: { required: true },
          value: '',
          state: null,
        },
        {
          key: 'message',
          label: '備註',
          rule: { required: false },
          value: '',
          state: null,
        },
      ],
    }
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      // console.log("getValidationState -> validated", validated, valid)
      return dirty || validated ? valid : null;
    },
    methodsRules(ruleName) {
      console.log("methodsRules -> ruleName", ruleName);
    },
    resetModal() {
      this.items = [
        {
          key: 'name',
          label: '姓名',
          rule: { required: true },
          value: '',
          state: null,
        },
        {
          key: 'email',
          label: '信箱',
          rule: { required: true, email: true },
          value: '',
          state: null,
        },
        {
          key: 'tel',
          label: '手機',
          rule: { required: true, numeric: true },
          value: '',
          state: null,
        },
        {
          key: 'address',
          label: '居住地',
          rule: { required: true },
          value: '',
          state: null,
        },
        {
          key: 'message',
          label: '備註',
          rule: { required: false },
          value: '',
          state: null,
        },
      ];
    },
    // 送出表單
    onSubmit() {
      const form = this.items.reduce((pre, item) => {
        // if(item.key !== 'message') ({...pre, [item.key]: item.value});
        if (item.key !== 'message') {
          return {...pre, [item.key]: item.value};
        }
        return pre;
      }, {});
      console.log('🚀 ~ file: OrderUserModal.vue ~ line 154 ~ onSubmit ~ form', form);
    },
    checkFormValidity() {
      console.log('⛑️: checkFormValidity');
      // this.nameState = valid
      // return valid
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
    },
  },
}
</script>
