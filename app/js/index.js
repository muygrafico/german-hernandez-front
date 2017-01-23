
(function () {

Vue.component('inputFilter',{
  template:
    `<div class="input-filter">
      <p class="control">
        <input
        class="input"
        type="text"
        placeholder="Search"
        v-on:keyup="filter({text: filterText})"
        v-model="filterText">
        <a v-show="this.filterText !== ''" @click="resetFilterText" class="delete is-small"></a>
      </p>
    </div>`,
    data() {
      return {
        filterText: ''
      }
    },
    methods: {
      resetFilterText: function() {
        this.filterText = '';
        this.filter({text: this.filterText});
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
          <ul v-for="filters in filtersSwitch">

            <li v-for="filter in filters">
              <a>{{ filter.name }}</a>
            </li>
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
        // categories: ''
      }
    },
    props: ['categories', 'filter', 'filtersSwitch']
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
          <div class="product-categories">

            <span v-for="category in categories" class="category-text tag">{{ findCategoryById(category) }}</span>
          </div>
        </div>
      </div>`,
  props: ['img', 'name', 'price', 'description', 'best_seller', 'available', 'id', 'categories', 'storeCategories'],
  computed: {
    pic: function () {
      return this.img + '/' + Math.floor((Math.random() * 10) + 1);
    }
  },
  methods: {
    addToCart: function (product) {
      console.log(product)
    },
    findCategoryById: function (id) {
      return result = this.storeCategories.filter(function(v) {
        return v.categori_id === id;
      })[0].name;
    }
   }

  })

  Vue.component('store',{
    template:
      `<div class="store">
        <div class="columns">
          <div class="column is-2">
            <filtersMenu :filter="this.filter" :filtersSwitch="filtersSwitch"> <filtersMenu>
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
              :categories="product.categories"
              :storeCategories="filtersSwitch.categories"
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
        cart: [],
        filtersSwitch: {
          categories: [],
          other_filters: [
            {
              "id": 1,
              "name": "Available"
            },
            {
              "id": 2,
              "name": "Unavailable"
            },
            {
              "id": 3,
              "name": "Best seller"
            }
          ],
          price: [
            {
              "id": 1,
              "name": "Higher than $30,000"
            },
            {
              "id": 2,
              "name": "Lower than $10,000"
            }
          ]
        }
      }
    }, mounted(){
      axios.get('json/data.json').then(
        (response) => {
          // this.categories = response.data.categories
          this.filtersSwitch['categories'] = response.data.categories
          this.products = response.data.products
          this.filteredProducts = this.products

          for (x in this.filtersSwitch) {
            for (y in this.filtersSwitch[x]) {
              this.filtersSwitch[x][y].status = false
            }
          }
        }
      )
    },
    methods: {
      addToCart: function (productId) {
        this.cart.push(productId)
        console.log(this.cart)
      },
      filter: function(options) {

        this.filteredProducts = this.products.filter(el => {
          var result
          function checkCategory(categoryId) { return categoryId === 3 }
          result =
          el.name.toLowerCase().includes(options.text.toLowerCase())
          && el.categories.find(checkCategory)
          return result

          // function checkCategory(categoryId) {
          //   return categoryId === 3 || el.name.toLowerCase().includes(text.toLowerCase())
          // }
          //
          // return el.categories.find(checkCategory)
          // console.log(el.categories)


        });

      }
    }

  })

  new Vue({el: '#storeApp'})

})();
