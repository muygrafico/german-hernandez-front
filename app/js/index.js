
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
    props: ['filter']
})

Vue.component('filtersMenu',{
  template:
    `<aside class="menu filter-menu">
      <p class="menu-label">
        Filters
      </p>
      <inputFilter :filter="this.filter"></inputFilter>

      <ul class="menu-list">
        <li>
          <h5>Categories</h5>
          <ul>
            <li v-for="category in categories">
              <a>{{ category.name }}</a>
            </li>
          </ul>
        </li>

        <li>
          <h5>Other filters</h5>
          <ul>
            <li><a>Available</a></li>
            <li><a>Unvailable</a></li>
            <li><a>Best seller</a></li>
          </ul>
        </li>

        <li>
          <h5>Price</h5>
          <ul>
            <li><a>Higher than $30,000</a></li>
            <li><a>Lower than $10,000</a></li>
          </ul>
        </li>
        <li>
          <h5>Order by:</h5>
          <ul>
            <li><a>Name</a></li>
            <li><a>Higher price</a></li>
            <li><a>Lower price</a></li>
          </ul>
        </li>
      </ul>
    </aside>`,
    data() {
      return {
        categories: ''
      }
    },
    props: ['categories']
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
        <div class="columns">
          <div class="column is-2">
            <filtersMenu :categories="categories"> <filtersMenu>
          </div>
          <div class="column">
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
          </div>
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
          return el.name.toLowerCase().includes(text.toLowerCase())
        });

      }
    }

  })

  new Vue({el: '#storeApp'})

})();
