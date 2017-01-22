
(function () {
  Vue.component('product',{
    template:
      `<div class="column is-one-third">
        <div class="product" v-bind:class="{ unavailable: !available }">
          <div class="image">
            <span class="icon best-seller" v-show="best_seller">
              <i class="fa fa-star"></i>
            </span>
            <img :src="pic">
          </div>
          <div class="name">{{ name }}</div>
          <hr>
          <div class="description">
            {{ description }}
          </div>
          <div class="product-footer">
            <div class="price">$\{{ price }}</div>
          </div>
          <div class="button-container">
            <button v-show="available" v-on:click="addToCart(id)" class="button is-primary">Add to cart</button>
            <span v-show="!available" class="button is-disabled">Not available</span>
          </div>

        </div>
      </div>`,
  props: ['img', 'name', 'price', 'description', 'best_seller', 'available', 'id'],
  computed: {
    pic: function () {
      return this.img + '/' + Math.floor((Math.random() * 10) + 1);
    }
  },
  methods: {
    addToCart: function (product) {
      console.log(product)
    }
   }

  })

  Vue.component('store',{
    template:
      `<div class="columns is-multiline">
        <product
        :img="product.img"
        :name="product.name"
        :price="product.price"
        :description="product.description"
        :best_seller="product.best_seller"
        :available="product.available"
        :id="product.id"
        v-for="(product, index) in products"></product>
      </div>`,
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
