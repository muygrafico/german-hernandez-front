
(function () {
  Vue.component('item',{
    template:
      `<div class="column is-one-quarter">
        <div class="product">
          <a>
            <div class="image">
              <img :src="pic">
            </div>
            <div class="name">{{ name }}</div>
            <div class="timestamp">2 hours ago</div>
          </a>
        </div>
      </div>`,
  props: ['img', 'name'],
  computed: {
    pic: function () {
      return this.img + '/' + Math.floor((Math.random() * 10) + 1);
    }
   }
  })

  Vue.component('store',{
    template: '<div class="columns is-multiline"><item :img="product.img" :name="product.name" v-for="(product, index) in products"></item></div>',
    data() {
      return {
        categories: [],
        products: []
      }
    }, mounted(){
      axios.get('json/data.json').then(
        (response) => {
          this.categories = response.data.categories
          this.products = response.data.products
        })
    }
  })

  new Vue({el: '#storeApp'})

})();
