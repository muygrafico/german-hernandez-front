
(function () {

Vue.component('inputFilter',{
  template:
    `<div class="input-filter">
      <p class="control">
        <input
        class="input"
        type="text"
        placeholder="Enter new search"
        v-on:keyup="filter(filterText)"
        v-model="filterText"
        >
      </p>
    </div>`,
    data() {
      return {
        filterText: ''
      }
    },
    props: ['filter'],
})


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
            <div v-show="available"><slot></slot></div>
            <span v-show="!available" class="button is-disabled">
              Not available
            </span>
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
      `<div class="store">
        <inputFilter :filter="this.filter"></inputFilter>
        <div class="columns is-multiline">
          <product
          :img="product.img"
          :name="product.name"
          :price="product.price"
          :description="product.description"
          :best_seller="product.best_seller"
          :available="product.available"
          :id="product.id"

          v-for="product in filteredProducts">
            <button class="button is-primary" @click="addToCart(product.id)">Add to cart</button>
          </product>
        </div>
      </div>`,
    data() {
      return {
        categories: [],
        products: [],
        filteredProducts: [],
        cart: []
      }
    }, mounted(){
      axios.get('json/data.json').then(
        (response) => {
          this.categories = response.data.categories
          this.products = response.data.products
          this.filteredProducts = this.products
        }
      )
    },
    methods: {
      addToCart: function (productId) {
        this.cart.push(productId)
        console.log(this.cart)
      },
      filter: function(text) {
        
        this.filteredProducts = this.products.filter(el => {
          return el.name.includes(text)
        });

      }
    }

  })

  new Vue({el: '#storeApp'})

})();
